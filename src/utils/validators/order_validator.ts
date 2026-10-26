import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";

export const createCashOrderValidator = [
    body("shippingAddress")
        .notEmpty()
        .withMessage("Shipping address is required").isObject().withMessage("Shipping address must be an object"),
        body("shippingAddress.details")
        .notEmpty()
        .withMessage("Shipping address details is required")
        .isString()
        .withMessage("Shipping address details must be a string"),
    body("shippingAddress.phone")
        .notEmpty()
        .withMessage("Shipping address phone is required")
        .isMobilePhone("any")
        .withMessage("Shipping address phone must be a valid phone number"),
    body("shippingAddress.city")
        .notEmpty()
        .withMessage("Shipping address city is required")
        .isString()
        .withMessage("Shipping address city must be a string")
    , validatorMiddleware
];