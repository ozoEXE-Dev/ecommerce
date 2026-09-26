import brandRouter from "./brand.js";
import categoryRouter from "./category.js";
import productRouter from "./product.js";
import subcategoryRouter from "./subcategory.js";
import { Router } from "express";

const router = Router();
router.use(categoryRouter);
router.use(subcategoryRouter);
router.use(brandRouter);
router.use(productRouter)
export default router;