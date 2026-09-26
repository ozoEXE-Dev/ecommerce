import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";

export const createBrand = [
    check("name").isLength({ min: 3, max: 32 }).withMessage("brand name length should be between 3 to 32")
        .notEmpty().withMessage("brand name is required"), validatorMiddleware
]

export const getBrand = [
    check("id").isMongoId().withMessage("invalid brand id format"), validatorMiddleware
]
export const updateBrand = [
    check("id").isMongoId().withMessage("invalid brand id format"), check("name").isLength({ min: 3, max: 32 }).withMessage("brand name length should be between 3 to 32")
        .notEmpty().withMessage("brand name is required"), validatorMiddleware
]
export const deleteBrand = [
    check("id").isMongoId().withMessage("invalid brand id format"), validatorMiddleware
]

