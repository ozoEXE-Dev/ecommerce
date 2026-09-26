import type { Request, Response } from "express";
import * as subcategoryService from "../services/subcategory_service.js";
import AppError from "../errors/AppError.js";
import * as factoryHandlers from "./factory_handlers.js";


// @desc create category
// @route post /api/categories
// @access private
export const createSubCategory = async (req: Request, res: Response) => {
    if(req.params.category){
        req.body.category = req.params.category;
    }
    const { body } = req;
    const subcategory = await subcategoryService.createSubcategory(body);
    res.status(201).send({ data: subcategory });
}

// @desc get all categories
// @route get /api/categories
// @access public
export const getSubcategories = async (req: Request, res: Response) => {
    let filter: any = {};
    if (req.params.category) {
        filter = { category: req.params.category };
    }
    const subcategories = await subcategoryService.getSubcategories(req.query, filter);
    res.status(200).json(subcategories);
}

// @desc delete category using id
// @route delete /api/categories/:id
// @access private
export const deleteSubcategory = factoryHandlers.deleteOne(subcategoryService.deleteSubcategory);

// @desc get specific category using id
// @route get /api/categories/:id
// @access public
export const getSubCategory = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const subcategory = await subcategoryService.getSubCategory(id);
    if (!subcategory) {
        throw new AppError(404, "there is no subcategory with this id: " + id);
    }
    res.status(200).send({ data: subcategory });
}

// @desc update category using id
// @route put /api/categories/:id
// @acess private
export const updateSubCategory = factoryHandlers.updateOne(subcategoryService.updateSubCategory);