import mongoose from "mongoose";
import AppError from "./AppError.js"

export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {

        return res.status(err.statusCode).json({ success: false, message: err.message });
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ success: false, message: `invalid ${err.path}:${err.value}` })
    }

    if (err instanceof mongoose.Error.ValidationError) {

        const messages = Object.values(err.errors)
            .map(error => error.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: "value already exists" });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "json web token is not valid" })
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "json web token is expired" })
    }
    console.log(err)
    res.status(500).json({ success: false, message: "internatl server error" });
 }