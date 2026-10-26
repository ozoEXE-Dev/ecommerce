import type { Request, Response } from "express";
import * as reviewService from "../services/review_service.js";

import * as factoryHandlers from "./factory_handlers.js";

// @desc create review
// @route post /api/v1/reviews
// @access private user allowed
export const createReview = async (req: Request, res: Response) => {

    if (req.params.productID) {
        req.body.product = req.params.productID;
    }
    const { body } = req;
    const subcategory = await reviewService.createReview(body);
    res.status(201).send({ data: subcategory });
}

// @desc get all reviews
// @route get /api/v1/reviews
// @access public
export const getReviews = async (req: Request, res: Response) => {
    let filter: any = {};
    if (req.params.productID) {
        filter = { product: req.params.productID };
    }
    const subcategories = await reviewService.getReviews(req.query, filter);
    res.status(200).json(subcategories);
}

// @desc get specific review using id
// @route get /api/v1/reviews/:id
// @access public
export const getReview = factoryHandlers.getOne(reviewService.getReview);

// @desc update review using id
// @route patch /api/v1/reviews/:id
// @acess private user allowed
export const updateReview = factoryHandlers.updateOne(reviewService.updateReview)

// @desc delete review using id
// @route delete /api/v1/reviews/:id
// @access private user manager admin
export const deleteReview = factoryHandlers.deleteOne(reviewService.deleteReview);

export const setProductIdAndUserIdToTheBody = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.product) req.body.product = req.params.productID;
    next();
}