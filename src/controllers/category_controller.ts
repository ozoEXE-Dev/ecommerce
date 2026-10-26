import { randomUUID } from "node:crypto";
import sharp from "sharp";
import type { Request, Response } from "express";
import * as categoryService from "../services/category_service.js";
import * as factoryHandlers from "./factory_handlers.js";
import { uploadSingleImage } from "../middlewares/upload_images.js";



// middleware for uploading
export const uploadCategoryImage = uploadSingleImage("image");

// middleware for resizing image
export const resizeImage = async (req, res, next) => {
    if (req.file) {
        const fileName = `category-${randomUUID()}-${Date.now()}.jpeg`;
        sharp(req.file.buffer).resize({ width: 600, height: 600 })
            .toFormat("jpeg").toFile(`uploads/categories/${fileName}`);
        req.body.image = fileName;
    }
    next();
}

// @desc create category
// @route post /api/v1/categories
// @access private
export const createCategory = factoryHandlers.createOne(categoryService.createCategory);

// @desc get all categories
// @route get /api/v1/categories
// @access public
export const getCategories = factoryHandlers.getAll(categoryService.getCategories)

// @desc get specific category using id
// @route get /api/v1/categories/:id
// @access public
export const getCategory = factoryHandlers.getOne(categoryService.getCategory);
// @desc update category using id
// @route patch /api/v1/categories/:id
// @acess private
export const updateCategory = factoryHandlers.updateOne(categoryService.updateCategory);

// @desc delete category using id
// @route delete /api/v1/categories/:id
// @access private
export const deleteCategory = factoryHandlers.deleteOne(categoryService.deleteCategory);