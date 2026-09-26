import type { Request, Response } from "express";
import * as categoryService from "../services/category_service.js";
import AppError from "../errors/AppError.js";
import * as factoryHandlers from "./factory_handlers.js";


// @desc create category
// @route post /api/categories
// @access private
export const createCategory = factoryHandlers.createOne(categoryService.createCategory);

// @desc get all categories
// @route get /api/categories
// @access public
export const getCategories = async (req: Request, res: Response) => {

    const categories = await categoryService.getCategories(req.query);
    return res.status(200).json(categories);
}

// @desc get specific category using id
// @route get /api/categories/:id
// @access public
export const getCategory = factoryHandlers.getOne(categoryService.getCategory);
// @desc update category using id
// @route put /api/categories/:id
// @acess private
export const updateCategory = factoryHandlers.updateOne(categoryService.updateCategory);

// @desc delete category using id
// @route delete /api/categories/:id
// @access private
export const deleteCategory = factoryHandlers.deleteOne(categoryService.deleteCategory);