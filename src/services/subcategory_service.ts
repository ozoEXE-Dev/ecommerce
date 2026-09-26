import Subcategory from "../models/subcategory_model.js";
import Category from "../models/category_model.js";
import slugify from "slugify";
import ApiFeatures from "../utils/api_features.js";

export const createSubcategory = (body)=>{
    return  Subcategory.create({...body, slug: slugify(body.name)});
}

export const getSubcategories = async(query, filter)=>{
    const documentsCount = await Subcategory.countDocuments(filter);
    const apiFeatures = new ApiFeatures(query, Subcategory.find(filter));
    apiFeatures.filter().search().fields().sort().paginate(documentsCount);
    const subcategories = await apiFeatures.mongooseQuery;
    return { results: subcategories.length, paginationResults: apiFeatures.pagination, data: subcategories};
}

export const deleteSubcategory = (id:string) =>{
    return Subcategory.findByIdAndDelete(id);
}

export const getSubCategory = (id:string)=>{
    return Subcategory.findById(id);
}

export const updateSubCategory = (id:string, body)=>{
    return Subcategory.findByIdAndUpdate(id,{...body, slug:slugify(body.name)},{returnDocument: "after"});
}