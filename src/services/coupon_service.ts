import Coupon from "../models/coupon_model.js";
import ApiFeatures from "../utils/api_features.js";

export const createCoupon = (body) => {
    return Coupon.create(body);
}

export const getCoupons = async(query) => {
    const documentsCount = await Coupon.countDocuments();
    const apiFeatures = new ApiFeatures(query, Coupon.find());
    apiFeatures.filter().search().fields().sort().paginate(documentsCount);
    const coupons = await apiFeatures.mongooseQuery;
    return { results: coupons.length, paginationResults: apiFeatures.pagination, data: coupons};
}

export const getCoupon = (id: string) => {
    return Coupon.findById(id);
}

export const updateCoupon = (id: string, body) => {
    return Coupon.findOneAndUpdate({ _id: id }, body, { returnDocument: "after" });
}

export const deleteCoupon = (id: string) => {
    return Coupon.findByIdAndDelete(id);
}