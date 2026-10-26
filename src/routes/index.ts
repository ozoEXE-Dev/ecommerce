import { Router } from "express";
import brandRouter from "./brand.js";
import categoryRouter from "./category.js";
import productRouter from "./product.js";
import subcategoryRouter from "./subcategory.js";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import reviewRouter from "./review.js";
import wishlistRouter from "./wishlist.js";
import addressesRouter from "./address.js";
import couponRouter from "./coupon.js";
import cartRouter from "./cart.js";
import orderRouter from "./order.js";


const router = Router();
router.use(categoryRouter);
router.use(subcategoryRouter);
router.use(brandRouter);
router.use(productRouter)
router.use(userRouter)
router.use(authRouter);
router.use(reviewRouter);
router.use(wishlistRouter)
router.use(addressesRouter)
router.use(couponRouter)
router.use(cartRouter)
router.use(orderRouter)
export default router;