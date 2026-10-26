import slugify from "slugify";
import Review from "../models/review_model.js";
import ApiFeatures from "../utils/api_features.js";

export const createReview = (body) => {
    return Review.create(body)

}

export const getReviews = async (query, filter) => {
    const documentsCount = await Review.countDocuments();
    const apiFeatures = new ApiFeatures(query, Review.find(filter));
    apiFeatures.filter().search("Review").fields().sort().paginate(documentsCount);
    const reviews = await apiFeatures.mongooseQuery;
    return { results: reviews.length, paginationResults: apiFeatures.pagination, data: reviews };
}

export const getReview = (id: string) => {
    return Review.findById(id);
}

export const updateReview = async (id: string, body) => {
    const review = await Review.findOneAndUpdate({ _id: id }, body, { returnDocument: "after" });
    if (review) {
        review.save();
    }
    return review;
}

export const deleteReview = async (id: string,) => {
    const document = await Review.findByIdAndDelete(id);
    await (Review as any).calculateRatingAvgAndQuantity(document!.product)
    return document;
}