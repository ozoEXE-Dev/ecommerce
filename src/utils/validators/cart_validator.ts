import { body, param } from "express-validator";
import Product from "../../models/product_model.js";
import AppError from "../../errors/AppError.js";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import Cart from "../../models/cart_model.js";

export const addProductToCartValidator = [
	body("product")
		.isMongoId()
		.withMessage("Product must be a valid MongoDB ID")
		.bail()
		.custom(async (productId: string) => {
			const productExists = await Product.exists({ _id: productId });

			if (!productExists) {
				throw new AppError(404, "Product does not exist");
			}

			return true;
		}), validatorMiddleware
];
export const deleteProductFromCartValidator = [param("id")
	.isMongoId()
	.withMessage("cart item must be a valid MongoDB ID")
	.bail()
	.custom(async (_, { req }) => {
		const cartItemExists = await Cart.exists({ "cartItems._id": req.params!.id });
		console.log(cartItemExists);
		if (!cartItemExists) {
			throw new AppError(404, "cart item does not exist");
		}
		return true;
	}), validatorMiddleware
]

export const updateQuantityValidator = [param("id")
	.isMongoId()
	.withMessage("cart item must be a valid MongoDB ID")
	.bail()
	.custom(async (_, { req }) => {
		const cartItemExists = await Cart.exists({ "cartItems._id": req.params!.id });
		console.log(cartItemExists);
		if (!cartItemExists) {
			throw new AppError(404, "cart item does not exist");
		}
		return true;
	}), body("quantity").isFloat({ min: 1 }), validatorMiddleware]

