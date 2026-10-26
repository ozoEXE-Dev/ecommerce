import * as categoryController from "../controllers/category_controller.js";
import { Router } from "express";
import * as categoryValidator from "../utils/validators/category_validator.js";
import { allowedFor, protect } from "../controllers/auth_controller.js";

const categoryRouter = Router();

categoryRouter.post("/api/v1/categories", protect, allowedFor("manager", "admin"), categoryController.uploadCategoryImage, categoryValidator.createCategory, categoryController.resizeImage, categoryController.createCategory);
categoryRouter.get("/api/v1/categories", categoryController.getCategories);
categoryRouter.get("/api/v1/categories/:id", categoryValidator.getCategory, categoryController.getCategory);
categoryRouter.patch("/api/v1/categories/:id", protect, allowedFor("manager", "admin"), categoryController.uploadCategoryImage, categoryValidator.updateCategory, categoryController.resizeImage, categoryController.updateCategory);
categoryRouter.delete("/api/v1/categories/:id", protect, allowedFor("manager", "admin"), categoryValidator.deleteCategory, categoryController.deleteCategory);

export default categoryRouter;