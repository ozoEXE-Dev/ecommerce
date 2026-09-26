import { Router } from "express";
import * as subcategoryController from "../controllers/subcategory_controller.js";
import * as subcategoryValidator from "../utils/validators/subcategory_validator.js";
const subcategoryRouter = Router();

subcategoryRouter.post("/api/subcategories", subcategoryValidator.createSubcategory, subcategoryController.createSubCategory);
subcategoryRouter.post("/api/:category/subcategories", subcategoryValidator.createSubcategory, subcategoryController.createSubCategory);
subcategoryRouter.get("/api/subcategories", subcategoryController.getSubcategories);
subcategoryRouter.get("/api/:category/subcategories", subcategoryValidator.getSubcategoriesFromCategory ,subcategoryController.getSubcategories);
subcategoryRouter.delete("/api/subcategories/:id", subcategoryValidator.deleteSubcategory, subcategoryController.deleteSubcategory)
subcategoryRouter.get("/api/subcategories/:id", subcategoryValidator.getSubcategory, subcategoryController.getSubCategory);
subcategoryRouter.patch("/api/subcategories/:id", subcategoryValidator.updateSubcategory, subcategoryController.updateSubCategory);
export default subcategoryRouter;