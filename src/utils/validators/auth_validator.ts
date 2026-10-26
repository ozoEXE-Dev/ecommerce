import { body, checkSchema } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import AppError from "../../errors/AppError.js";
import { getUserByEmail } from "../../services/user_service.js";


/*
 * Create user
 *
 * Body:
 * {
 *     name: "Nike Air Max"
 * }
 *
 * Automatically creates:
 * slug: "nike-air-max"
 */
export const signup = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 32 })
        .withMessage("Name must be between 3 and 32 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email").custom(async (value: string) => {
            const user = await getUserByEmail(value);

            if (user) {
                throw new AppError(400, "Email already exists");
            }

            return true;
        },),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
    , body("confirmPassword").notEmpty().withMessage("confirm password cannot be empty").custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new AppError(400, "confirm password is incorrect");
        }
        return true;
    }).withMessage("confirm password not equal password"),
    validatorMiddleware
];


export const signin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
    validatorMiddleware
];
