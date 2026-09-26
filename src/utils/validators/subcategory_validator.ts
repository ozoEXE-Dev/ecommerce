import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";

export const createSubcategory = [
    check("name").isLength({ min: 2, max: 32 }).withMessage("subcategory name length should be between 2 to 32")
        .notEmpty().withMessage("subcategory name is required"), check("category").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]

export const getSubcategory = [
    check("id").isMongoId().withMessage("invalid subcategory id format"), validatorMiddleware
]

export const getSubcategoriesFromCategory = [
    check("category").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]

export const updateSubcategory = [
    check("id").isMongoId().withMessage("invalid subcategory id format"), check("name").isLength({ min: 2, max: 32 }).withMessage("subcategory name length should be between 2 to 32")
        .notEmpty().withMessage("subcategory name is required"), validatorMiddleware
]
export const deleteSubcategory = [
    check("id").isMongoId().withMessage("invalid subcategory id format"), validatorMiddleware
]
