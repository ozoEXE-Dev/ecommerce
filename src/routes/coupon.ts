import * as couponController from "../controllers/coupon_controller.js";
import { Router } from "express";
import * as couponValidator from "../utils/validators/coupon_validator.js";
import { allowedFor, protect } from "../controllers/auth_controller.js";


const couponRouter = Router();

couponRouter.post("/api/v1/coupons", protect, allowedFor("manager", "admin"), couponValidator.createCoupon, couponController.createCoupon);
couponRouter.get("/api/v1/coupons",protect, allowedFor("manager", "admin"), couponController.getCoupons);
couponRouter.get("/api/v1/coupons/:id", protect, allowedFor("manager", "admin"), couponValidator.getCoupon, couponController.getCoupon);
couponRouter.patch("/api/v1/coupons/:id", protect, allowedFor("manager", "admin"), couponValidator.updateCoupon, couponController.updateCoupon);
couponRouter.delete("/api/v1/coupons/:id", protect, allowedFor("manager", "admin"), couponValidator.deleteCoupon, couponController.deleteCoupon);

export default couponRouter;

