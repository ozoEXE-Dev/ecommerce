import { Router } from "express";
import * as subcategoryController from "../controllers/subcategory_controller.js";
import * as subcategoryValidator from "../utils/validators/subcategory_validator.js";
import { protect, allowedFor } from "../controllers/auth_controller.js";
const subcategoryRouter = Router();

subcategoryRouter.post("/api/v1/subcategories",protect, allowedFor("manager", "admin"), subcategoryValidator.createSubcategory, subcategoryController.createSubCategory);
subcategoryRouter.post("/api/v1/categories/:category/subcategories",protect, allowedFor("manager", "admin"), subcategoryValidator.createSubcategoryFromCategory, subcategoryController.createSubCategory);
subcategoryRouter.get("/api/v1/subcategories", subcategoryController.getSubcategories);
subcategoryRouter.get("/api/v1/categories/:category/subcategories", subcategoryValidator.getSubcategoriesFromCategory ,subcategoryController.getSubcategories);
subcategoryRouter.delete("/api/v1/subcategories/:id",protect, allowedFor("manager", "admin"), subcategoryValidator.deleteSubcategory, subcategoryController.deleteSubcategory)
subcategoryRouter.get("/api/v1/subcategories/:id", subcategoryValidator.getSubcategory, subcategoryController.getSubCategory);
subcategoryRouter.patch("/api/v1/subcategories/:id",protect, allowedFor("manager", "admin"), subcategoryValidator.updateSubcategory, subcategoryController.updateSubCategory);
export default subcategoryRouter;
