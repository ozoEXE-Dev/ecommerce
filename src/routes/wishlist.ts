import { protect, allowedFor } from "../controllers/auth_controller.js";
import { Router } from "express";
import * as wishlistController from "../controllers/wishlist_controller.js"
import * as wishlistValidator from "../utils/validators/wishlist_validator.js"
const wishlistRouter = Router();

wishlistRouter.post("/api/v1/wishlist", protect, allowedFor("user"), wishlistValidator.addProductToWishlistValidator, wishlistController.addProductToWishlist);
wishlistRouter.delete("/api/v1/wishlist/:id", protect, allowedFor("user"), wishlistValidator.deleteProductFromWishlistValidator, wishlistController.deleteProductFromWishlist);
wishlistRouter.get("/api/v1/wishlist/me",protect,allowedFor("user"), wishlistController.getMyWishList)
export default wishlistRouter;