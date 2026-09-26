import type { Request, Response } from "express";
import * as brandService from "../services/brand_service.js";
import AppError from "../errors/AppError.js";
import * as factoryHandlers from "./factory_handlers.js";


// @desc create brand
// @route post /api/brands
// @access private
export const createBrand =  factoryHandlers.createOne(brandService.createBrand);

// @desc get all brands
// @route get /api/brands
// @access public
export const getBrands = async (req: Request, res: Response) => {
    const brands = await brandService.getBrands(req.query);
    return res.status(200).json(brands);
}

// @desc get specific brand using id
// @route get /api/brands/:id
// @access public
export const getBrand = factoryHandlers.getOne(brandService.getBrand);

// @desc update brand using id
// @route put /api/brands/:id
// @acess private
export const updateBrand = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const brand = await brandService.updateBrand(id, body);
    if (!brand) {
        throw new AppError(404, "brand not found");
    }
    return res.status(200).json({ data: brand });
}

// @desc delete brand using id
// @route delete /api/brands/:id
// @access private
export const deleteBrand = factoryHandlers.deleteOne(brandService.deleteBrand);