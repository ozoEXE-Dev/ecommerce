import Order from '../models/order_model.js';
import Cart from '../models/cart_model.js';
import Product from '../models/product_model.js';
import AppError from '../errors/AppError.js';
import Stripe from 'stripe';
import "dotenv/config"
import User from '../models/user_model.js';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCashOrder = async (req) => {
    const shippingFee = 0;
    const taxPrice = 0;
    //get cart based on logged in user
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new AppError(404, 'Cart not found');

    //calculate total order price based on cart price, tax and shipping fee and apply coupon if any
    let totalPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    totalPrice = totalPrice! + taxPrice + shippingFee;

    //create order
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalPrice,
        paymentMethodType: 'cash',
    });

    //after creating order, decrement product quantity, increment product sold, clear cart
    if (order) {
        const bulkOptions: any = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product!._id },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }))
        await Product.bulkWrite(bulkOptions, {});
    }
    await Cart.findByIdAndDelete(cart._id);

    return order;
}

export const getMyOrders = async (userId) => {
    const orders = await Order.find({ user: userId }).populate({ path: 'user', select: 'name email phone profileImg' }).sort({ createdAt: -1 });
    return orders
}

export const getAllOrders = async () => {
    const orders = await Order.find().populate({ path: 'user', select: 'name email phone profileImg' }).sort({ createdAt: -1 });
    return orders;
}

export const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId).populate({ path: 'user', select: 'name email phone profileImg' });
    if (!order) throw new AppError(404, 'Order not found');
    return order;
}

export const getMyOrderById = async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate({ path: 'user', select: 'name email phone profileImg' });
    if (!order) throw new AppError(404, 'Order not found');
    return order;
}

export const updateOrderToPaid = async (orderId) => {
    const order = await Order.findByIdAndUpdate(orderId, { isPaid: true, paidAt: Date.now() }, { new: true });
    if (!order) throw new AppError(404, 'Order not found');
    return order;
}

export const updateOrderToDelivered = async (orderId) => {
    const order = await Order.findByIdAndUpdate(orderId, { isDelivered: true, deliveredAt: Date.now() }, { new: true });
    if (!order) throw new AppError(404, 'Order not found');
    return order;
}


export const checkoutSession = async (req) => {

    // App settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1. Get cart based on cartId
    const cart = await Cart.findById(req.params!.id);

    if (!cart) {
        throw new AppError(404, 'Cart not found');
    }

    // 2. Calculate order price
    const cartPrice = cart.totalPriceAfterDiscount
        ?? cart.totalCartPrice;

    const totalOrderPrice = cartPrice! + taxPrice + shippingPrice;

    // 3. Create Stripe Checkout Session
    const session = await stripeClient.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `Order by ${req.user.name}`,
                    },
                    unit_amount: Math.round(totalOrderPrice * 100)
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/api/v1/orders/me`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart/me`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: {
            shippingAddress: req.body.shippingAddress,
        },
    });

    // 4. Send session to response
    return session;
}


const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user!._id,
    cartItems: cart!.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart!.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

export const webhookCheckout = async (req) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeClient.webhooks.constructEvent(
            req.body,
            sig,
            (process.env.STRIPE_WEBHOOK_SECRET as string)
        );
    } catch (err) {
        return false;
    }
    if (event.type === 'checkout.session.completed') {
        //  Create order
        await createCardOrder(event.data.object);
    }
    return true
};