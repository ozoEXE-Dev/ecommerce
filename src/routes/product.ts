import * as productController from "../controllers/product_controller.js";
import { Router } from "express";
import * as productValidator from "../utils/validators/product_validator.js"

const productRouter = Router();

productRouter.post("/api/products", ...productValidator.createProduct, productController.createProduct);
productRouter.get("/api/products", productController.getproducts);
productRouter.get("/api/products/:id", productValidator.getProduct, productController.getProduct);
productRouter.patch("/api/products/:id", ...productValidator.updateProduct, productController.updateProduct);
productRouter.delete("/api/products/:id", productValidator.deleteProduct, productController.deleteProduct);
 
export default productRouter;