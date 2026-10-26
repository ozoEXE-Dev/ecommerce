import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);



const Cart = mongoose.model('Cart', cartSchema);

export type cartType = NonNullable<
  Awaited<ReturnType<typeof Cart.findOne>>
>;
export default Cart;