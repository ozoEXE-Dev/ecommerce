import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";

export const createCategory = [
    check("name").isLength({ min: 3, max: 32 }).withMessage("category name length should be between 3 to 32")
        .notEmpty().withMessage("category name is required"), validatorMiddleware
]

export const getCategory = [
    check("id").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]
export const updateCategory = [
    check("id").isMongoId().withMessage("invalid category id format"), check("name").isLength({ min: 3, max: 32 }).withMessage("category name length should be between 3 to 32")
        .notEmpty().withMessage("category name is required"), validatorMiddleware
]
export const deleteCategory = [
    check("id").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]
