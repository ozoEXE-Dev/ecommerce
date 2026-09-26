import * as brandController from "../controllers/brand_controller.js";
import { Router } from "express";
import * as brandValidator from "../utils/validators/brand_validator.js";

const brandRouter = Router();

brandRouter.post("/api/brands", brandValidator.createBrand, brandController.createBrand);
brandRouter.get("/api/brands", brandController.getBrands);
brandRouter.get("/api/brands/:id", brandValidator.getBrand, brandController.getBrand);
brandRouter.patch("/api/brands/:id", brandValidator.updateBrand, brandController.updateBrand);
brandRouter.delete("/api/brands/:id", brandValidator.deleteBrand, brandController.deleteBrand);
 
export default brandRouter;