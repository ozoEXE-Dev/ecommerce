import type { Request, Response } from "express";
import * as productService from "../services/product_service.js";
import * as factoryHandlers from "./factory_handlers.js";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { uploadMixOfImages } from "../middlewares/upload_images.js";




export const uploadProductImages = uploadMixOfImages([{ name: "imageCover", maxCount: 1 }, { name: "images", maxCount: 5 }]);

export const resizeProductImages = async (req, res, next) => {
    //resize image cover

    const imageCover = req.files?req.files.imageCover : undefined;
    if (imageCover) {
        console.log(true)
        const imageCoverFileName = `product-${randomUUID()}-${Date.now()}-cover.jpeg`;
        await sharp(imageCover[0]!.buffer).resize({ width: 2000, height: 1333 }).toFormat("jpeg").toFile(`uploads/products/${imageCoverFileName}`);
        req.body.imageCover = imageCoverFileName;
    }
    //resize product images
    const images = req.file? req.files.images: undefined;
    req.body.images = [];
    if (images) {
        await Promise.all(images.map(async (image, index) => {
            const imageFileName = `product-${randomUUID()}-${Date.now()}-${index}.jpeg`
            await sharp(image.buffer).resize({ width: 2000, height: 1333 }).toFormat("jpeg").toFile(`uploads/products/${imageFileName}`)
            req.body.images.push(imageFileName);
        }))
    }
    next();
}

// @desc create product
// @route post /api/v1/products
// @access private
export const createProduct = factoryHandlers.createOne(productService.createProduct);

// @desc get all products
// @route get /api/v1/products
// @access public
export const getProducts = factoryHandlers.getAll(productService.getProducts)

// @desc get specific product using id
// @route get /api/v1/products/:id
// @access public
export const getProduct = factoryHandlers.getOne(productService.getProduct);

// @desc update product using id
// @route patch /api/v1/products/:id
// @acess private
export const updateProduct = factoryHandlers.updateOne(productService.updateProduct);

// @desc delete product using id
// @route delete /api/v1/products/:id
// @access private
export const deleteProduct = factoryHandlers.deleteOne(productService.deleteProduct);
