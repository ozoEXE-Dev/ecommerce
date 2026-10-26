import Cart from "../models/cart_model.js";
import Product from "../models/product_model.js";
import type { cartType } from "../models/cart_model.js";
import AppError from "../errors/AppError.js";
import User from "../models/user_model.js";
import Coupon from "../models/coupon_model.js";
const calculateTotalPrice = (cart: cartType) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        const price = item.quantity * item.price!;
        totalPrice += price;
    })
    cart.set("totalPriceAfterDiscount", undefined);
    return totalPrice;
}

export const addProductToCart = async (req): Promise<boolean> => {
    const cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(req.body.product);
    if (!cart) {
        // if theere is no cart create cart and add the product to the cart
        const cartItem = [{ product: req.body.product, quantity: 1, color: req.body.color, price: product!.price }]
        await Cart.create({ user: req.user.id, cartItems: cartItem, totalCartPrice: product!.price })
        return true
    } else {
        //if there is cart check if the product with the given color exist in the cart.
        const itemIndex = cart.cartItems.findIndex((item) => {
            console.log(item.product!.id);
            console.log(req.body.product);
            console.log(req.body.color);
            console.log(item.color);
            return (item.product == req.body.product && req.body.color == item.color)
        })
        if (itemIndex == -1) {
            //if the product is not in the cart push it to the cart
            const cartItem = { product: req.body.product, color: req.body.color, price: product!.price, quantity: 1 }
            cart.cartItems.push(cartItem);
        } else {
            // if the product in the cart increment the quantity
            cart.cartItems[itemIndex]!.quantity += 1
        }
        cart.totalCartPrice = calculateTotalPrice(cart);
        await cart.save();
        return true;
    }
}

export const getLoggedUserCart = (id) => {
    return Cart.findOne({ user: id });
};

export const deleteCartItem = async (req) => {
    const cart = await Cart.findOneAndUpdate({ user: req.user.id }, { $pull: { cartItems: { _id: req.params.id } } }, { returnDocument: "after" });
    if (!cart) {
        throw new AppError(404, "user doesn't have cart")
    }
    cart!.totalCartPrice = calculateTotalPrice(cart);
    cart.save();
    return cart;
}

export const clearCart = (req) => {
    return Cart.findOneAndDelete({ user: req.user.id })
}

export const updateQuantity = async (req) => {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        throw new AppError(404, "use doesn't have cart")
    }
    const itemIndex = cart!.cartItems.findIndex((item) => item._id.toString() == req.params.id);
    if (itemIndex == -1) {
        throw new AppError(404, "cart item not found")
    } else {
        cart.cartItems[itemIndex]!.quantity = req.body.quantity
    }
    cart.totalCartPrice = calculateTotalPrice(cart);
    cart.save();
    return cart;
}

export const applyCoupon = async (req) => {
    const coupon = await Coupon.findOne({ name: req.body.coupon, expire: { $gt: Date.now() } });
    if (!coupon) {
        throw new AppError(400, "coupon is invalid or expired");
    }
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
        throw new AppError(404, "use doesn't have cart")
    }
    cart.totalPriceAfterDiscount = cart.totalCartPrice! - (cart.totalCartPrice! * coupon.discount / 100);
    await cart.save();
    return cart;
}