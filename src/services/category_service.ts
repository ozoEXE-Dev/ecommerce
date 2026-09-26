import slugify from "slugify";
import Category from "../models/category_model.js"
import ApiFeatures from "../utils/api_features.js";

export const createCategory =  (body) => {
    return  Category.create({
        ...body,slug: slugify(body.name)
    }
    )
}

export const getCategories = async(query)=>{
    const documentsCount = await Category.countDocuments();
    const apiFeatures = new ApiFeatures(query, Category.find());
    apiFeatures.filter().search().fields().sort().paginate(documentsCount);
    const categories = await apiFeatures.mongooseQuery;
    return { results: categories.length, paginationResults: apiFeatures.pagination, data: categories };
}

export const getCategory = (id: string)=>{
    return  Category.findById(id);
}

export const updateCategory = (id:string, body)=>{
    return  Category.findOneAndUpdate({_id: id},{...body, slug: slugify(body.name)},{returnDocument:"after"});
}

export const deleteCategory = (id:string,) =>{
    return  Category.findByIdAndDelete(id);
}