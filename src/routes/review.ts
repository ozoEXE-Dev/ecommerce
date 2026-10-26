import * as reviewController from "../controllers/review_controller.js";
import { Router } from "express";
import * as reviewValidator from "../utils/validators/review_validator.js";
import { allowedFor, protect } from "../controllers/auth_controller.js";
import { param } from "express-validator";


const reviewRouter = Router();

reviewRouter.post("/api/v1/reviews", protect, allowedFor("user"), reviewController.setProductIdAndUserIdToTheBody, reviewValidator.createReviewValidator, reviewController.createReview);
reviewRouter.get("/api/v1/products/:productID/reviews", reviewController.getReviews)
reviewRouter.post("/api/v1/products/:productID/reviews", protect, allowedFor("user"), reviewController.setProductIdAndUserIdToTheBody, reviewValidator.createReviewWithProductValidator, reviewController.createReview)
reviewRouter.get("/api/v1/reviews", reviewController.getReviews);
reviewRouter.get("/api/v1/reviews/:id", reviewValidator.getReviewValidator, reviewController.getReview);
reviewRouter.get("/api/v1/products/:productID/reviews/:id",param("productID").isMongoId().withMessage("invalid product id"),reviewValidator.getReviewValidator, reviewController.getReview)
reviewRouter.patch("/api/v1/reviews/:id", protect, allowedFor("user"), reviewValidator.updateReviewValidator, reviewController.updateReview);
reviewRouter.delete("/api/v1/reviews/:id", protect, allowedFor("user", "manager", "admin"),reviewValidator.deleteReviewValidator, reviewController.deleteReview);

export default reviewRouter;