import type { Request, Response } from "express";
import * as productService from "../services/product_service.js";
import AppError from "../errors/AppError.js";
import * as factoryHandlers from "./factory_handlers.js";


// @desc create product
// @route post /api/products
// @access private
export const createProduct = factoryHandlers.createOne(productService.createProduct);

// @desc get all products
// @route get /api/products
// @access public
export const getproducts = async (req: Request, res: Response) => {
    const products = await productService.getProducts(req.query);
    return res.status(200).json(products);
}

// @desc get specific product using id
// @route get /api/products/:id
// @access public
export const getProduct = factoryHandlers.getOne(productService.getProduct);

// @desc update product using id
// @route put /api/products/:id
// @acess private
export const updateProduct =  factoryHandlers.updateOne(productService.updateProduct);

// @desc delete product using id
// @route delete /api/products/:id
// @access private
export const deleteProduct = factoryHandlers.deleteOne(productService.deleteProduct);
