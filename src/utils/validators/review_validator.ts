import { body, param } from "express-validator";
import { getUser } from "../../services/user_service.js";
import { getProduct } from "../../services/product_service.js";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import AppError from "../../errors/AppError.js";
import Review from "../../models/review_model.js";

export const createReviewValidator = [
    // Validate the review title.
    body("title")
        .optional()
        .isString()
        .withMessage("Review title must be a string")
        .trim(),

    // Validate the review ratings.
    body("ratings")
        .notEmpty()
        .withMessage("Review ratings are required")
        .bail()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Ratings must be between 1 and 5"),

    // Validate the user ID and check whether the user exists.
    body("user")
        .notEmpty()
        .withMessage("Review must belong to a user")
        .bail()
        .isMongoId()
        .withMessage("Invalid user ID")
        .bail()
        .custom(async (userId, { req }) => {
            const user = await getUser(userId);

            if (!user) {
                throw new AppError(404, "User not found");
            }
            if (user.role !== "user") {
                throw new AppError(403, "only user can add review")
            }
            if (req.user.id != req.body.user) {
                throw new AppError(403, "you cannot add review for other user")
            }
            return true;
        }),

    // Validate the product ID and check whether the product exists.
    body("product")
        .notEmpty()
        .withMessage("Review must belong to a product")
        .bail()
        .isMongoId()
        .withMessage("Invalid product ID")
        .bail()
        .custom(async (productId, { req }) => {
            const product = await getProduct(productId);

            if (!product) {
                throw new AppError(404, "Product not found");
            }
            const review = await Review.findOne({ product: productId, user: req.user.id })
            if (review) {
                console.log(true);
                throw new AppError(400, "user already added review for this product");
            }
            return true;
        }),
    validatorMiddleware
];

export const createReviewWithProductValidator = [
    // Validate the review title.
    body("title")
        .optional()
        .isString()
        .withMessage("Review title must be a string")
        .trim(),

    // Validate the review ratings.
    body("ratings")
        .notEmpty()
        .withMessage("Review ratings are required")
        .bail()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Ratings must be between 1 and 5"),

    // Validate the user ID and check whether the user exists.
    body("user")
        .notEmpty()
        .withMessage("Review must belong to a user")
        .bail()
        .isMongoId()
        .withMessage("Invalid user ID")
        .bail()
        .custom(async (userId, { req }) => {
            const user = await getUser(userId);

            if (!user) {
                throw new AppError(404, "User not found");
            }
            if (user.role !== "user") {
                throw new AppError(403, "only user can add review")
            }
            if (req.user.id != req.body.user) {
                throw new AppError(403, "you cannot add review for other user")
            }
            return true;
        }),

    // Validate the product ID and check whether the product exists.
    param("productID")
        .notEmpty()
        .withMessage("Review must belong to a product")
        .bail()
        .isMongoId()
        .withMessage("Invalid product ID")
        .bail()
        .custom(async (productId, { req }) => {
            const product = await getProduct(productId);

            if (!product) {
                throw new AppError(404, "Product not found");
            }
            const review = await Review.findOne({ product: productId, user: req.user.id })
            if (review) {
                throw new AppError(400, "user already added review for this product");
            } console.log(true);
            return true;
        }),
    validatorMiddleware
];

export const updateReviewValidator = [
    param("id").isMongoId().withMessage("invalid review id").custom(async (id, { req }) => {
        const review = await Review.findById(id);
        if (!review) {
            throw new AppError(404, `No review with this id ${id}`)
        }
        if (req.user.id != review.user.id) {
            throw new AppError(400, "you are now allowed to perform this action");
        }
        return true;
    }),
    // Validate the title if provided.
    body("title")
        .optional()
        .isString()
        .withMessage("Review title must be a string")
        .trim(),

    // Validate the ratings if provided.
    body("ratings")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Ratings must be between 1 and 5"),

    // Validate the user ID and check whether the user exists if provided.
    body("user")
        .optional()
        .isMongoId()
        .withMessage("Invalid user ID")
        .bail()
        .custom(async (userId, { req }) => {
            const user = await getUser(userId);

            if (!user) {
                throw new AppError(404, "User not found");
            }
            if (user.role !== "user") {
                throw new AppError(403, "only user can update review")
            }

            if (req.user.id != req.body.user) {
                throw new AppError(403, "you cannot update review for other user")
            }

            return true;
        }),

    // Validate the product ID and check whether the product exists if provided.
    body("product")
        .optional()
        .isMongoId()
        .withMessage("Invalid product ID")
        .bail()
        .custom(async (productId, { req }) => {
            const product = await getProduct(productId);

            if (!product) {
                throw new AppError(404, "Product not found");
            }

            return true;
        }),
    validatorMiddleware
];

export const deleteReviewValidator = [
    param("id").isMongoId().withMessage("invalid review id").custom(async (id, { req }) => {
        const review = await Review.findById(id);
        if (!review) {
            throw new AppError(404, `No review with this id ${id}`)
        }
        if (req.user.role == "user") {
            if (req.user.id != review.user.id) {
                throw new AppError(400, "you are now allowed to perform this action");
            }
        }

        return true;

    }), validatorMiddleware
]

export const getReviewValidator = [
    param("id").isMongoId().withMessage("invalid review id"),
    validatorMiddleware
];

