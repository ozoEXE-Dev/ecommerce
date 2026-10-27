import * as orderService from '../services/order_service.js';
import AppError from '../errors/AppError.js';
import * as factoryHandlers from './factory_handlers.js';


// @desc create cash order
// @route post /api/v1/orders/cash
// @access private
export const createCashOrder = async (req, res, next) => {
    const order = await orderService.createCashOrder(req);
    if(!order) throw new AppError(404, 'Order not created');
    res.status(201).json({ status: 'success', message: 'Order created successfully', data: order });
}

// @desc get my orders
// @route get /api/v1/orders/me
// @access private
export const getMyOrders = async (req, res, next) => {
    const userId = req.user._id;
    const orders = await orderService.getMyOrders(userId);
    res.status(200).json({ status: 'success', data: orders });
}

// @desc get all orders
// @route get /api/v1/orders
// @access private
export const getAllOrders = factoryHandlers.getAll(orderService.getAllOrders);

// @desc get order by id
// @route get /api/v1/orders/:id
// @access private
export const getOrderById = async(req, res, next) => {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if(!order) throw new AppError(404, 'Order not found');
    res.status(200).json({ status: 'success', data: order });
}

// @desc get my order by id
// @route get /api/v1/orders/me/:id
// @access private
export const getMyOrderById = async(req, res, next) => {
    const orderId = req.params.id;
    const userId = req.user._id;
    const order = await orderService.getMyOrderById(orderId, userId);
    if(!order) throw new AppError(404, 'Order not found');
    res.status(200).json({ status: 'success', data: order });
}

// @desc update order to paid
// @route patch /api/v1/orders/:id/pay
// @access private

export const updateOrderToPaid = async(req, res, next) => {
    const orderId = req.params.id;
    const order = await orderService.updateOrderToPaid(orderId);
    if(!order) throw new AppError(404, 'Order not found');
    res.status(200).json({ status: 'success', message: 'Order updated to paid successfully', data: order });
}

// @desc update order to delivered
// @route patch /api/v1/orders/:id/deliver
// @access private
export const updateOrderToDelivered = async(req, res, next) => {
    const orderId = req.params.id;
    const order = await orderService.updateOrderToDelivered(orderId);
    if(!order) throw new AppError(404, 'Order not found');
    res.status(200).json({ status: 'success', message: 'Order updated to delivered successfully', data: order });
}

export const checkoutSession = async (req, res, next) => {
  const session = await orderService.checkoutSession(req);
  if (!session) throw new AppError(404, 'Checkout session not created');
  res.status(200).json({ status: 'success', data: session });
};

export const webhookCheckout = async (req, res, next) => {
  const isValid = await orderService.webhookCheckout(req);
  if (!isValid) throw new AppError(400, 'Webhook error');
  res.status(200).json({ received: true });
}