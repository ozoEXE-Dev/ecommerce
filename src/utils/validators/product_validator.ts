import { check, checkSchema, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import { createProductValidationSchema } from "./schemas/product/create_product.js";
import { updateProductValidationSchema } from "./schemas/product/update_product.js";
import AppError from "../../errors/AppError.js";





export const createProduct = [
    checkSchema(createProductValidationSchema), check("imageCover")
        .custom((_, { req }) => { //checks if image cover is not uploaded throw error
            if (!req.files?.["imageCover"]?.length) {
                throw new AppError(400,`image Cover is required`);
            }
            return true;
        }), check("images")
            .custom((_, { req }) => {// if product images are not uploaded throw error
                if (!req.files?.["images"]?.length) {
                    throw new AppError(400,`product images are required upload from 1 to 5 images`);
                }
                return true;
            }),
    validatorMiddleware,
];

export const getProduct = [
    param("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware
]
export const updateProduct = [
    checkSchema(updateProductValidationSchema),
    validatorMiddleware,
];
export const deleteProduct = [
    param("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware
]

