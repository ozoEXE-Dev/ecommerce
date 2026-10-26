import mongoose, { Mongoose, Query } from "mongoose";
import Product from "./product_model.js";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product'],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (this: Query<any, any>) {
  this.populate({ path: 'user', select: 'name' });
});

reviewSchema.statics.calculateRatingAvgAndQuantity = async function (productId) {
  const result = await this.aggregate([{
    $match: { product: productId }
  },
  {
    $group: { _id: "$product", avgRatings: { $avg: "$ratings" }, ratingsCount: { $sum: 1 } }
  }
  ])
  return await Product.findByIdAndUpdate(productId, { ratingsAverage: result[0] ? result[0].avgRatings : 0, ratingsQuantity: result[0] ? result[0].ratingsCount : 0 }, { returnDocument: "after" });
}

reviewSchema.post("save", async function () {
  await (this.constructor as any).calculateRatingAvgAndQuantity(this.product);
})


const Review = mongoose.model('Review', reviewSchema);
export default Review;