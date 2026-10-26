import * as cartController from "../controllers/cart_controller.js"
import { Router } from "express";
import * as cartValidator from "../utils/validators/cart_validator.js"
import { allowedFor, protect } from "../controllers/auth_controller.js";


const cartRouter = Router();

cartRouter.post("/api/v1/cart", protect, allowedFor("user"), cartValidator.addProductToCartValidator, cartController.addProductToCart)
cartRouter.get("/api/v1/cart/me", protect, allowedFor("user"), cartController.getLoggedUserCart)
cartRouter.delete("/api/v1/cart/clear", protect, allowedFor("user"), cartController.clearCart)
cartRouter.delete("/api/v1/cart/:id", protect, allowedFor("user"), cartValidator.deleteProductFromCartValidator, cartController.deleteCartItem)
cartRouter.patch("/api/v1/cart/:id", protect, allowedFor("user"), cartValidator.updateQuantityValidator, cartController.updateQuantity)
cartRouter.post("/api/v1/cart/coupon",protect,allowedFor("user"), cartController.applyCoupon)

export default cartRouter;