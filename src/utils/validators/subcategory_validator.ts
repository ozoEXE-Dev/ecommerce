import { body, check, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import slugify from "slugify";

export const createSubcategory = [
    body("name").isLength({ min: 2, max: 32 }).withMessage("subcategory name length should be between 2 to 32")
        .notEmpty().withMessage("subcategory name is required").trim().custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
                return true;
            }
        },), body("category").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]

export const getSubcategory = [
    param("id").isMongoId().withMessage("invalid subcategory id format"), validatorMiddleware
]

export const getSubcategoriesFromCategory = [
    param("category").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]

export const createSubcategoryFromCategory = [
    body("name").trim().isLength({ min: 2, max: 32 }).withMessage("subcategory name length should be between 2 to 32")
        .notEmpty().withMessage("subcategory name is required").custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
                return true;
            }
        },), param("category").isMongoId().withMessage("invalid category id format"), validatorMiddleware
]

export const updateSubcategory = [
    param("id").isMongoId().withMessage("invalid subcategory id format"), body("name").isLength({ min: 2, max: 32 }).withMessage("subcategory name length should be between 2 to 32")
        .notEmpty().withMessage("subcategory name is required").trim().custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
                return true;
            }
        }), validatorMiddleware
]
export const deleteSubcategory = [
    param("id").isMongoId().withMessage("invalid subcategory id format"), validatorMiddleware
]
