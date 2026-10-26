import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import Coupon from "../../models/coupon_model.js";

export const createCoupon = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Coupon name is required").custom(async (value) => {
            const coupon = await Coupon.findOne({ name: value });

            if (coupon) {
                throw new Error("Coupon name already exists");
            }

            return true;
        }),
    body("expire")
        .notEmpty()
        .withMessage("Coupon expiration date is required")
        .isISO8601()
        .withMessage("Coupon expiration date must be a valid date"),
    body("discount")
        .notEmpty()
        .withMessage("Coupon discount is required")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Coupon discount must be between 0 and 100"),
    validatorMiddleware,
];

export const getCoupon = [
    param("id").isMongoId().withMessage("Invalid coupon id format").custom(async (id) => {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        return true;
    }),
    validatorMiddleware,
];

export const updateCoupon = [
    param("id").isMongoId().withMessage("Invalid coupon id format").custom(async (id) => {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        return true;
    }),
    body("name").optional().trim().notEmpty().withMessage("Coupon name cannot be empty").custom(async (value, { req }) => {
        const coupon = await Coupon.findOne({
            name: value,
            _id: { $ne: req.params!.id },
        });

        if (coupon) {
            throw new Error("Coupon name already exists");
        } return true;
    }),
    body("expire")
        .optional()
        .isISO8601()
        .withMessage("Coupon expiration date must be a valid date"),
    body("discount")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Coupon discount must be between 0 and 100"),
    validatorMiddleware,
];

export const deleteCoupon = [
    param("id").isMongoId().withMessage("Invalid coupon id format").custom(async (id) => {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        return true;
    }),
    validatorMiddleware,
];


