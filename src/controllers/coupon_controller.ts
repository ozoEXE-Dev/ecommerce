import * as couponService from "../services/coupon_service.js";
import * as factoryHandlers from "./factory_handlers.js";

// @desc create coupon
// @route post /api/v1/coupons
// @access private
export const createCoupon = factoryHandlers.createOne(couponService.createCoupon);

// @desc get all coupons
// @route get /api/v1/coupons
// @access private
export const getCoupons = factoryHandlers.getAll(couponService.getCoupons);

// @desc get specific coupon using id
// @route get /api/v1/coupons/:id
// @access private
export const getCoupon = factoryHandlers.getOne(couponService.getCoupon);

// @desc update coupon using id
// @route patch /api/v1/coupons/:id
// @access private
export const updateCoupon = factoryHandlers.updateOne(couponService.updateCoupon);

// @desc delete coupon using id
// @route delete /api/v1/coupons/:id
// @access private
export const deleteCoupon = factoryHandlers.deleteOne(couponService.deleteCoupon);