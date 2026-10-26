import { body, check, param } from "express-validator";
import mongoose from "mongoose";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validator_middleware.js";
import AppError from "../../errors/AppError.js";


/*
 * Create Brand
 *
 * Body:
 * {
 *     name: "Nike Air Max"
 * }
 *
 * Automatically creates:
 * slug: "nike-air-max"
 */
export const createBrand= [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Brand name is required")
        .isLength({ min: 3, max: 32 })
        .withMessage("Brand name length should be between 3 and 32 characters")
        .custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
            }
            return true;
        }), check("image").custom((_, { req }) => {
            // if brand image is not uploaded throw error
                if (!req.file) {
                    throw new AppError(400,`brand image is required`);
                }
                return true;
            }),validatorMiddleware
];

/*
 * Get Brand
 *
 * Route:
 * GET /brands/:id
 */

export const getBrand = [
    param("id").isMongoId().withMessage("invalid brand id format"), validatorMiddleware
]
/*
 * Update Brand
 *
 * Route:
 * PUT /brands/:id
 *
 * Body:
 * {
 *     name: "Adidas"
 * }
 *
 * Automatically updates:
 * slug: "adidas"
 */

export const updateBrand = [
    param("id").isMongoId().withMessage("invalid brand id format"), body("name").trim().optional().isLength({ min: 3, max: 32 }).withMessage("brand name length should be between 3 to 32")
        .notEmpty().withMessage("brand name is required").custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value);
                return true;
            }
        },), validatorMiddleware
]
/*
 * Delete Brand
 *
 * Route:
 * DELETE /brands/:id
 */


export const deleteBrand = [
    param("id").isMongoId().withMessage("invalid brandid format"), validatorMiddleware
]
