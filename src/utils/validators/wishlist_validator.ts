import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import { getProduct } from "../../services/product_service.js";
import AppError from "../../errors/AppError.js";

export const addProductToWishlistValidator = [
    body("product").isMongoId().withMessage("invalid product id").notEmpty().withMessage("product id is required").trim()
        .custom(async (productId, { req }) => {
            const product = await getProduct(productId);
            if (!product) {
                throw new AppError(404, "product not found")
            }
            return true;
        }),
    validatorMiddleware
]
export const deleteProductFromWishlistValidator = [
    param("id").isMongoId().withMessage("invalid product id").notEmpty().withMessage("product id is required")
    , validatorMiddleware
]