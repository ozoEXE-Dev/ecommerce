import slugify from "slugify";
import Product from "../models/product_model.js"
import type { Request } from "express";
import { fstat } from "node:fs";
import ApiFeatures from "../utils/api_features.js";

export const createProduct = (body) => {
    return Product.create(body);

}

export const getProducts = async (query) => {
    const documentsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(query, Product.find().populate("category","name -_id"));
    apiFeatures.filter().search("product").fields().sort().paginate(documentsCount);
    const products = await apiFeatures.mongooseQuery;
    return { results: products.length, paginationResults: apiFeatures.pagination, data: products };
}

export const getProduct = (id: string) => {
    return Product.findById(id).populate("category", "name -_id");
}

export const updateProduct = (id: string, body) => {
    // body.slug = slugify(body.title);
    return Product.findOneAndUpdate({ _id: id }, body, { returnDocument: "after" });
}

export const deleteProduct = (id: string,) => {
    return Product.findByIdAndDelete(id);
}