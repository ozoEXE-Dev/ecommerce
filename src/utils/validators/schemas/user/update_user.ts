import slugify from "slugify";
import User from "../../../../models/user_model.js";
import AppError from "../../../../errors/AppError.js";
import { getUserByEmail } from "../../../../services/user_service.js";

const updateUserValidationSchema = {
    id: {
        in: "params" as const,
        isMongoId: {
            errorMessage: "Invalid user ID",
        },
    },

    name: {
        optional: true,
        trim: true,
        notEmpty: {
            errorMessage: "Name cannot be empty",
        },
        custom: {
            options: (value: string, { req }) => {
                req.body.slug = slugify(value, { lower: true });
                return true;
            },
        },
    },

    email: {
        optional: true,
        trim: true,
        isEmail: {
            errorMessage: "Invalid email address",
        },
        normalizeEmail: true,
        custom: {
            options: async (value: string, { req }) => {
                const user = await getUserByEmail(value);

                if (user) {
                    throw new AppError(400,"Email already exists");
                }

                return true;
            },
        },
    },

    phone: {
        optional: true,
        isMobilePhone: {
            options: ["any"] as const,
            errorMessage: "Invalid phone number",
        },
    },

    profileImg: {
        optional: true,
        isString: {
            errorMessage: "Profile image must be a string",
        },
    },

    role: {
        optional: true,
        isIn: {
            options: [["user", "manager", "admin"]],
            errorMessage: "Invalid role",
        },
    },

    active: {
        optional: true,
        isBoolean: {
            errorMessage: "Active must be a boolean",
        },
        toBoolean: true,
    },
}

// same as the first one but with no checking for id
export const updateLoggedUserValidationSchema = {
    name: {
        optional: true,
        trim: true,
        notEmpty: {
            errorMessage: "Name cannot be empty",
        },
        custom: {
            options: (value: string, { req }) => {
                req.body.slug = slugify(value, { lower: true });
                return true;
            },
        },
    },

    email: {
        optional: true,
        trim: true,
        isEmail: {
            errorMessage: "Invalid email address",
        },
        normalizeEmail: true,
        custom: {
            options: async (value: string, { req }) => {
                const user = await getUserByEmail(value);

                if (user) {
                    throw new AppError(400,"Email already exists");
                }

                return true;
            },
        },
    },

    phone: {
        optional: true,
        isMobilePhone: {
            options: ["any"] as const,
            errorMessage: "Invalid phone number",
        },
    },

    profileImg: {
        optional: true,
        isString: {
            errorMessage: "Profile image must be a string",
        },
    },

    role: {
        optional: true,
        isIn: {
            options: [["user", "manager", "admin"]],
            errorMessage: "Invalid role",
        },
    },

    active: {
        optional: true,
        isBoolean: {
            errorMessage: "Active must be a boolean",
        },
        toBoolean: true,
    },
}


export default updateUserValidationSchema