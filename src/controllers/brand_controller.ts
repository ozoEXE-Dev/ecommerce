import type { Request, Response } from "express";
import * as brandService from "../services/brand_service.js";
import * as factoryHandlers from "./factory_handlers.js";
import { uploadSingleImage } from "../middlewares/upload_images.js";
import { randomUUID } from "crypto";
import sharp from "sharp";


// middleware for uploading
export const uploadBrandImage = uploadSingleImage("image");

// middleware for resizing image
export const resizeImage = async (req, res, next) => {
    if (req.file) {
        const fileName = `brand-${randomUUID()}-${Date.now()}.jpeg`;
        sharp(req.file.buffer).resize({ width: 600, height: 600 })
            .toFormat("jpeg").toFile(`uploads/brands/${fileName}`);
        req.body.image = fileName;
    }
    next();

}

// @desc create brand
// @route post /api/v1/brands
// @access private
export const createBrand = factoryHandlers.createOne(brandService.createBrand);

// @desc get all brands
// @route get /api/v1/brands
// @access public
export const getBrands = factoryHandlers.getAll(brandService.getBrands)

// @desc get specific brand using id
// @route get /api/v1/brands/:id
// @access public
export const getBrand = factoryHandlers.getOne(brandService.getBrand);

// @desc update brand using id
// @route patch /api/v1/brands/:id
// @acess private
export const updateBrand = factoryHandlers.updateOne(brandService.updateBrand)

// @desc delete brand using id
// @route delete /api/v1/brands/:id
// @access private
export const deleteBrand = factoryHandlers.deleteOne(brandService.deleteBrand);