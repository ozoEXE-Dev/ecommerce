import * as productController from "../controllers/product_controller.js";
import { Router } from "express";
import * as productValidator from "../utils/validators/product_validator.js"
import { allowedFor, protect } from "../controllers/auth_controller.js";

const productRouter = Router();

productRouter.post("/api/v1/products",protect, allowedFor("manager", "admin"), productController.uploadProductImages, ...productValidator.createProduct, productController.resizeProductImages, productController.createProduct);
productRouter.get("/api/v1/products", productController.getProducts);
productRouter.get("/api/v1/products/:id", productValidator.getProduct, productController.getProduct);
productRouter.patch("/api/v1/products/:id",protect, allowedFor("manager", "admin"), productController.uploadProductImages ,...productValidator.updateProduct,productController.resizeProductImages ,productController.updateProduct);
productRouter.delete("/api/v1/products/:id",protect, allowedFor("manager", "admin"), productValidator.deleteProduct, productController.deleteProduct);

export default productRouter;