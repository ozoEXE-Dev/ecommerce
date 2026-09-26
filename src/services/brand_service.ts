import slugify from "slugify";
import Brand from "../models/brand_model.js";
import ApiFeatures from "../utils/api_features.js";

export const createBrand = (body) => {
    return Brand.create({
        ...body,
        slug: slugify(body.name),
    })

}

export const getBrands = async(query) => {
    const documentsCount = await Brand.countDocuments();
    const apiFeatures = new ApiFeatures(query, Brand.find());
    apiFeatures.filter().search().fields().sort().paginate(documentsCount);
    const brands = await apiFeatures.mongooseQuery;
    return { results: brands.length, paginationResults: apiFeatures.pagination, data: brands};
}

export const getBrand = (id: string) => {
    return Brand.findById(id);
}

export const updateBrand = (id: string, body) => {
    return Brand.findOneAndUpdate({ _id: id }, { ...body, slug: slugify(body.name) }, { returnDocument: "after" });
}

export const deleteBrand = (id: string,) => {
    return Brand.findByIdAndDelete(id);
}