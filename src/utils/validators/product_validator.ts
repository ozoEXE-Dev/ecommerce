import { check, checkSchema } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import slugify from "slugify";
import Category from "../../models/category_model.js";
import Subcategory from "../../models/subcategory_model.js";
import AppError from "../../errors/AppError.js";
import Product from "../../models/product_model.js";
import { createProductValidationSchema } from "./schemas/product/create_product.js";
import { updateProductValidationSchema } from "./schemas/product/update_product.js";





export const createProduct = [
    checkSchema(createProductValidationSchema),
    validatorMiddleware,
];



export const getProduct = [
    check("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware
]
export const updateProduct = [
    checkSchema(updateProductValidationSchema),
    validatorMiddleware,
];
export const deleteProduct = [
    check("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware
]

