import slugify from "slugify"
import AppError from "../../../../errors/AppError.js";
import Category from "../../../../models/category_model.js";
import Subcategory from "../../../../models/subcategory_model.js";


export const createProductValidationSchema = {
        title: {
            notEmpty: {
                errorMessage: "Product required",
            },
            isLength: {
                options: { min: 3 },
                errorMessage: "must be at least 3 chars",
            },
            custom: {
                options: (value, { req }) => {
                    req.body.slug = slugify(value);
                    return true;
                },
            },
        },

        description: {
            notEmpty: {
                errorMessage: "Product description is required",
            },
            isLength: {
                options: { max: 2000 },
                errorMessage: "Too long description",
            },
        },

        quantity: {
            notEmpty: {
                errorMessage: "Product quantity is required",
            },
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
            notEmpty: {
                errorMessage: "Product price is required",
            },
            isNumeric: {
                errorMessage: "Product price must be a number",
            },
            isLength: {
                options: { max: 32 },
                errorMessage: "Too long price",
            },
        },

        priceAfterDiscount: {
            optional: true,
            isNumeric: {
                errorMessage: "Product priceAfterDiscount must be a number",
            },
            toFloat: true,
            custom: {
                options: (value, { req }) => {
                    if (req.body.price <= value) {
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
                errorMessage: "availableColors should be array of string",
            },
        },

        imageCover: {
            notEmpty: {
                errorMessage: "Product imageCover is required",
            },
        },

        images: {
            optional: true,
            isArray: {
                errorMessage: "images should be array of string",
            },
        },

        category: {
            notEmpty: {
                errorMessage: "Product must belong to a category",
            },
            isMongoId: {
                errorMessage: "Invalid ID format",
                bail: true,
            },
            custom: {
                options: async (categoryId) => {
                    const category = await Category.findById(categoryId);

                    if (!category) {
                        throw new AppError(
                            404,
                            `No category for this id: ${categoryId}`
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
            },
            custom: {
                options: async (subcategories, { req }) => {
                    const data = await Subcategory.find({
                        _id: { $in: subcategories },
                    });

                    if (
                        data.length < subcategories.length ||
                        data.length < 1
                    ) {
                        throw new AppError(
                            400,
                            "Invalid subcategories ids"
                        );
                    }

                    const subcategoriesInTheCategory =
                        await Subcategory.find({
                            category: req.body.category,
                        });

                    const subcategoriesIdsInTheCategory =
                        subcategoriesInTheCategory.map(
                            (subcategory) => subcategory.id
                        );

                    const allBelongToCategory = subcategories.every(
                        (id) =>
                            subcategoriesIdsInTheCategory.includes(id)
                    );

                    if (!allBelongToCategory) {
                        throw new AppError(
                            400,
                            "Not all subcategories are children of the given category"
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
                errorMessage: "Invalid ID format",
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
    };