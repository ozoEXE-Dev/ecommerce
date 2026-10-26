import { body, check, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import slugify from "slugify";
import AppError from "../../errors/AppError.js";

export const createCategory = [
    body("name").isLength({ min: 3, max: 32 }).withMessage("category name length should be between 3 to 32")
        .notEmpty().withMessage("category name is required").trim().custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
                return true;
            }
        },), check("image").custom((_, { req }) => {// if category image is not uploaded throw error
                if (!req.file) {
                    throw new AppError(400,`category image is required`);
                }
                return true;
            }), validatorMiddleware
]

export const getCategory = [
    param("id").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]
export const updateCategory = [
    param("id").isMongoId().withMessage("invalid category id format"), body("name").optional().trim().isLength({ min: 3, max: 32 }).withMessage("category name length should be between 3 to 32")
        .notEmpty().withMessage("category name is required").custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
                return true;
            }
        },), validatorMiddleware
]
export const deleteCategory = [
    param("id").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]
