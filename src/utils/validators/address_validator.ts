import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";


export const createAddressValidator = [
    body("alias")
        .notEmpty().withMessage("alias is required")
        .isString()
        .withMessage("Alias must be a string")
        .trim(),

    body("details")
        .notEmpty()
        .withMessage("Address details are required")
        .isString()
        .withMessage("Address details must be a string")
        .trim(),

    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("any")
        .withMessage("Invalid phone number").trim().isMobilePhone("any")
    ,

    body("city")
        .notEmpty()
        .withMessage("City is required")
        .isString()
        .withMessage("City must be a string")
        .trim(),

    body("postalCode")
        .optional()
        .isString()
        .withMessage("Postal code must be a string")
        .trim(),
    validatorMiddleware
];


export const updateAddressValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid address ID"),

    body("alias")
        .optional()
        .isString()
        .withMessage("Alias must be a string")
        .trim(),

    body("details")
        .optional()
        .isString()
        .withMessage("Address details must be a string")
        .trim()
        .notEmpty()
        .withMessage("Address details cannot be empty"),

    body("phone")
        .optional()
        .isMobilePhone("any")
        .withMessage("Invalid phone number").trim().isMobilePhone("any")
,

    body("city")
        .optional()
        .isString()
        .withMessage("City must be a string")
        .trim()
        .notEmpty()
        .withMessage("City cannot be empty"),

    body("postalCode")
        .optional()
        .isString()
        .withMessage("Postal code must be a string")
        .trim(),
    validatorMiddleware
];


export const deleteAddressValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid address ID"),
];