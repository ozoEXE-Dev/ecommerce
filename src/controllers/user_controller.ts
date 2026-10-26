import type { Request, Response } from "express";
import * as userService from "../services/user_service.js";
import AppError from "../errors/AppError.js";
import * as factoryHandlers from "./factory_handlers.js";
import { uploadSingleImage } from "../middlewares/upload_images.js";
import { randomUUID } from "crypto";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

// middleware for uploading
export const uploaduserImage = uploadSingleImage("profileImg");

// middleware for resizing image
export const resizeImage = async (req, res, next) => {
    if (req.file) {
        const fileName = `user-${randomUUID()}-${Date.now()}.jpeg`;
        sharp(req.file.buffer).resize({ width: 600, height: 600 })
            .toFormat("jpeg").toFile(`uploads/users/${fileName}`);
        req.body.profileImg = fileName;
    }
    next();
}

// @desc create user
// @route post /api/v1/users
// @access private
export const createUser = factoryHandlers.createOne(userService.createUser);

// @desc get all users
// @route get /api/v1/users
// @access private
export const getUsers = async (req: Request, res: Response) => {
    const users = await userService.getUsers(req.query);
    return res.status(200).json(users);
}

// @desc get specific user using id
// @route get /api/v1/users/:id
// @access private
export const getUser = factoryHandlers.getOne(userService.getUser);

// @desc get logged in user data
// @route get /api/v1/users/me
// @access private
export const getMe = async (req, res, next) => {
    if (!req.user) {
        throw new AppError(403, "You are not logged in, please log in");
    }
    res.status(200).json({ data: req.user });
}

// @desc update logged in user data
// @route get /api/v1/users/updateMe
// @access private
export const updateMe = async (req, res, next) => {
    if (!req.user) {
        throw new AppError(403, "You are not logged in, please log in");
    }
    const user = await userService.updateLoggedUser(req.user.id,req.body);
    res.status(200).json({data:user});
}

export const deleteMe = async (req, res, next) => {
  await userService.deleteLoggedUser(req.user.id);
  res.status(204).json({ status: 'Success' });
};

// @desc get logged in user data
// @route get /api/v1/users/updateMe
// @access private
export const changeMyPassword = async (req, res, next) => {
    if (!req.user) {
        throw new AppError(403, "You are not logged in, please log in");
    }
    const user = await userService.changeUserPassword(req.user.id, req.body)
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE_DATE as StringValue });
    res.status(200).json({ data: req.user, token });
}
// @desc update user using id
// @route patch /api/v1/users/:id
// @acess private
export const updateUser = factoryHandlers.updateOne(userService.updateUser);

export const changeUserPassword = factoryHandlers.updateOne(userService.changeUserPassword)

// @desc delete user using id
// @route delete /api/v1/users/:id
// @access private
export const deleteUser = factoryHandlers.deleteOne(userService.deleteUser);


