import * as brandController from "../controllers/brand_controller.js";
import { Router } from "express";
import * as brandValidator from "../utils/validators/brand_validator.js"
import { allowedFor, protect } from "../controllers/auth_controller.js";


const brandRouter = Router();

brandRouter.post("/api/v1/brands",protect,allowedFor("manager","admin"), brandController.uploadBrandImage, brandValidator.createBrand, brandController.resizeImage, brandController.createBrand);
brandRouter.get("/api/v1/brands", brandController.getBrands);
brandRouter.get("/api/v1/brands/:id", brandValidator.getBrand, brandController.getBrand);
brandRouter.patch("/api/v1/brands/:id",protect, allowedFor("manager","admin"), brandController.uploadBrandImage, brandValidator.updateBrand, brandController.resizeImage, brandController.updateBrand);
brandRouter.delete("/api/v1/brands/:id",protect, allowedFor("manager","admin"), brandValidator.deleteBrand, brandController.deleteBrand);

export default brandRouter;