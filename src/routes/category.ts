import * as categoryController from "../controllers/category_controller.js";
import { Router } from "express";
import * as categoryValidator from "../utils/validators/category_validator.js";

const categoryRouter = Router();

categoryRouter.post("/api/categories", categoryValidator.createCategory, categoryController.createCategory);
categoryRouter.get("/api/categories", categoryController.getCategories);
categoryRouter.get("/api/categories/:id", categoryValidator.getCategory, categoryController.getCategory);
categoryRouter.patch("/api/categories/:id", categoryValidator.updateCategory, categoryController.updateCategory);
categoryRouter.delete("/api/categories/:id", categoryValidator.deleteCategory, categoryController.deleteCategory);
 
export default categoryRouter;