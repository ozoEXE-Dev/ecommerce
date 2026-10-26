import slugify from "slugify";
import User from "../../../../models/user_model.js";
import AppError from "../../../../errors/AppError.js";
import { getUserByEmail } from "../../../../services/user_service.js";

const createUserValidationSchema = {
    name: {
        trim: true,
        notEmpty: {
            errorMessage: "Name is required",
        },
        custom: {
            options: (value: string, { req }) => {
                req.body.slug = slugify(value, { lower: true });
                return true;
            },
        },
    },

    email: {
        trim: true,
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Invalid email address",
        },
        normalizeEmail: true,
        custom: {
            options: async (value: string) => {
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

    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be at least 6 characters",
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

export default createUserValidationSchema