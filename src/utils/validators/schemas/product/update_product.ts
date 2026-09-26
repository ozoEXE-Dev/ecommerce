import slugify from "slugify"
import Product from "../../../../models/product_model.js";
import AppError from "../../../../errors/AppError.js";
import Category from "../../../../models/category_model.js";
import Subcategory from "../../../../models/subcategory_model.js";

export const updateProductValidationSchema = {
    id: {
        isMongoId: {
            errorMessage: "Invalid product ID format",
        },
    },

    title: {
        optional: true,

        isLength: {
            options: {
                min: 3,
                max: 100,
            },
            errorMessage: "Product title must be between 3 and 100 chars",
        },

        custom: {
            options: (value, { req }) => {
                req.body.slug = slugify(value);
                return true;
            },
        },
    },

    description: {
        optional: true,

        isLength: {
            options: {
                min: 20,
            },
            errorMessage: "Too short product description",
        },
    },

    quantity: {
        optional: true,

        isNumeric: {
            errorMessage: "Product quantity must be a number",
        },
    },

    sold: {
        optional: true,

        isNumeric: {
            errorMessage: "Product sold must be a number",
        },
    },

    price: {
        optional: true,

        isFloat: {
            options: {
                max: 200000,
            },
            errorMessage:
                "Product price must be a number less than or equal to 200000",
            bail: true,
        },

        custom: {
            options: async (price, { req }) => {
                let priceAfterDiscount = req.body.priceAfterDiscount;

                // If priceAfterDiscount isn't being updated,
                // get the existing value from the database
                if (priceAfterDiscount === undefined) {
                    const product = await Product.findById(req.params!.id);

                    if (!product) {
                        throw new AppError(404, "Product not found");
                    }

                    priceAfterDiscount = product.priceAfterDiscount;
                }

                // Product might not have a discount
                if (
                    priceAfterDiscount !== undefined &&
                    Number(price) <= Number(priceAfterDiscount)
                ) {
                    throw new AppError(
                        400,
                        "Price must be greater than priceAfterDiscount"
                    );
                }

                return true;
            },
        },
    },

    priceAfterDiscount: {
        optional: true,

        isNumeric: {
            errorMessage:
                "Product priceAfterDiscount must be a number",
            bail: true,
        },

        toFloat: true,

        custom: {
            options: async (value, { req }) => {
                // If price is being updated, use the new price
                if (req.body.price !== undefined) {
                    if (value >= Number(req.body.price)) {
                        throw new AppError(
                            400,
                            "priceAfterDiscount must be lower than price"
                        );
                    }

                    return true;
                }

                // Otherwise use the existing product price
                const product = await Product.findById(req.params!.id);

                if (!product) {
                    throw new AppError(404, "Product not found");
                }

                if (value >= product.price) {
                    throw new AppError(
                        400,
                        "priceAfterDiscount must be lower than price"
                    );
                }

                return true;
            },
        },
    },

    colors: {
        optional: true,

        isArray: {
            errorMessage: "Colors should be an array",
        },
    },

    imageCover: {
        optional: true,

        notEmpty: {
            errorMessage: "Product imageCover cannot be empty",
        },
    },

    images: {
        optional: true,

        isArray: {
            errorMessage: "Images should be an array",
        },
    },

    category: {
        optional: true,

        isMongoId: {
            errorMessage: "Invalid category ID format",
            bail: true,
        },

        custom: {
            options: async (categoryId, { req }) => {
                // 1. Check that the category exists
                const category = await Category.findById(categoryId);

                if (!category) {
                    throw new AppError(
                        404,
                        `No category for this id: ${categoryId}`
                    );
                }

                // 2. Get the new subcategories if supplied
                let subcategories = req.body.subcategories;

                // Otherwise get the product's existing subcategories
                if (subcategories === undefined) {
                    const product = await Product.findById(
                        req.params!.id
                    );

                    if (!product) {
                        throw new AppError(
                            404,
                            "Product not found"
                        );
                    }

                    subcategories = product.subcategories;
                }

                // Product has no subcategories
                if (
                    !subcategories ||
                    subcategories.length === 0
                ) {
                    return true;
                }

                const uniqueIds = [
                    ...new Set(
                        subcategories.map((id) =>
                            id.toString()
                        )
                    ),
                ];

                const count =
                    await Subcategory.countDocuments({
                        _id: {
                            $in: uniqueIds,
                        },
                        category: categoryId,
                    });

                if (count !== uniqueIds.length) {
                    throw new AppError(
                        400,
                        "One or more subcategories do not belong to the new category"
                    );
                }

                return true;
            },
        },
    },

    subcategories: {
        optional: true,

        isArray: {
            errorMessage: "Subcategories must be an array",
            bail: true,
        },

        custom: {
            options: async (subcategories, { req }) => {
                let categoryId = req.body.category;

                // If category isn't being changed,
                // use the existing category
                if (!categoryId) {
                    const product = await Product.findById(
                        req.params!.id
                    );

                    if (!product) {
                        throw new AppError(
                            404,
                            "Product not found"
                        );
                    }

                    categoryId = product.category;
                }

                const uniqueIds = [
                    ...new Set(subcategories),
                ];

                const count =
                    await Subcategory.countDocuments({
                        _id: {
                            $in: uniqueIds,
                        },
                        category: categoryId,
                    });

                if (count !== uniqueIds.length) {
                    throw new AppError(
                        400,
                        "One or more subcategories do not belong to the given category"
                    );
                }

                return true;
            },
        },
    },

    "subcategories.*": {
        optional: true,

        isMongoId: {
            errorMessage: "Invalid subcategory ID format",
        },
    },

    brand: {
        optional: true,

        isMongoId: {
            errorMessage: "Invalid brand ID format",
        },
    },

    ratingsAverage: {
        optional: true,

        isFloat: {
            options: {
                min: 1,
                max: 5,
            },
            errorMessage: "Rating must be between 1 and 5",
        },
    },

    ratingsQuantity: {
        optional: true,

        isNumeric: {
            errorMessage: "ratingsQuantity must be a number",
        },
    },
}

