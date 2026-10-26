import {Router} from 'express';
import * as orderController from '../controllers/order_controller.js';
import {protect, allowedFor} from "../controllers/auth_controller.js";
import * as orderValidator from "../utils/validators/order_validator.js";
const orderRouter = Router();

orderRouter.post('/api/v1/orders/cash', protect, allowedFor('user'), orderValidator.createCashOrderValidator, orderController.createCashOrder);
orderRouter.get('/api/v1/orders/me', protect, allowedFor('user'), orderController.getMyOrders);
orderRouter.get('/api/v1/orders', protect, allowedFor('admin','manager'), orderController.getAllOrders);
orderRouter.get('/api/v1/orders/:id', protect, allowedFor('admin','manager'), orderController.getOrderById);
orderRouter.get('/api/v1/orders/me/:id', protect, allowedFor('user'), orderController.getMyOrderById);
orderRouter.patch('/api/v1/orders/:id/pay', protect, allowedFor('admin','manager'), orderController.updateOrderToPaid);
orderRouter.patch('/api/v1/orders/:id/deliver', protect, allowedFor('admin','manager'), orderController.updateOrderToDelivered);
orderRouter.get('/api/v1/orders/checkout-session/:id', protect, allowedFor('user'), orderController.checkoutSession);
export default orderRouter;