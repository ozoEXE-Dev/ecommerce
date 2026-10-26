import { body, check, checkSchema, param } from "express-validator";
import bcrypt from "bcrypt"
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import AppError from "../../errors/AppError.js";
import createUserValidationSchema from "./schemas/user/create_user.js";
import updateUserValidationSchema, { updateLoggedUserValidationSchema } from "./schemas/user/update_user.js";
import User from "../../models/user_model.js";

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
export const createUser = [
    checkSchema(createUserValidationSchema), body("confirmPassword").notEmpty().withMessage("confirm password cannot be empty").custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new AppError(400, "confirm password is incorrect");
        }
        return true;
    }).withMessage("confirm password not equal password"), validatorMiddleware
];

/*
 * Get user
 *
 * Route:
 * GET /users/:id
 */

export const getUser = [
    param("id").isMongoId().withMessage("invalid user id format"), validatorMiddleware
]
/*
 * Update user
 *
 * Route:
 * patch /users/:id
 *
 * Body:
 * {
 *     name: "Adidas"
 * }
 *
 * Automatically updates:
 * slug: "adidas"
 */

export const updateUser = [
    checkSchema(updateUserValidationSchema), validatorMiddleware
]
export const updateLoggedUser = [
    checkSchema(updateLoggedUserValidationSchema), validatorMiddleware
]

export const changeUserPassword = [
    param("id").isMongoId().withMessage("invalid user id format"),
    body("currentPassword").notEmpty().withMessage("current password is required").custom(async (val, { req }) => {
        const user = await User.findById(req.params!.id);
        if (!user) {
            throw new AppError(400, `there is no user with this id: ${req.params!.id}`)
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new AppError(400, `current password is incorrect`)
        }
        return true;
    }), body("password").notEmpty().withMessage("password is required"),
    body("confirmPassword").notEmpty().withMessage("confirm password is required").custom(async (val, { req }) => {
        if (val != req.body.password) {
            throw new AppError(400, `confirm password not equal to password`)
        }
        return true;

    })
    , validatorMiddleware]
/*
 * Delete user
 *
 * Route:
 * DELETE /users/:id
 */


export const deleteUser = [
    param("id").isMongoId().withMessage("invalid userid format"), validatorMiddleware
]


export const changeMyPassword = [
    body("currentPassword").notEmpty().withMessage("current password is required").custom(async (val, { req }) => {
        const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, req.user.password);
        if (!isPasswordCorrect) {
            throw new AppError(400, `current password is incorrect`)
        }
        return true;
    }), body("password").notEmpty().withMessage("password is required"),
    body("confirmPassword").notEmpty().withMessage("confirm password is required").custom(async (val, { req }) => {
        if (val != req.body.password) {
            throw new AppError(400, `confirm password not equal to password`)
        }
        return true;

    })
    , validatorMiddleware]