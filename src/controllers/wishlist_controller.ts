import AppError from "../errors/AppError.js";
import * as wishlistService from "../services/wishlist_service.js"

// @desc add product to wishlist
// @route post /api/v1/wishlist
// @access private user
export const addProductToWishlist = async (req, res, next) => {
    const user = await wishlistService.addProductToWishlist(req);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ data: user.wishlist });
}

// @desc delte product product from wishlist
// @route delete /api/v1/wishlist
// @access private user
export const deleteProductFromWishlist = async (req, res, next) => {
    const user = await wishlistService.deleteProductFromWishList(req);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ data: user.wishlist });
}

// @desc get users wishlist
// @route get /api/v1/wishlist/me
// @access private user
export const getMyWishList = async (req, res, next) => {
    const user: any = await wishlistService.getMyWishlist(req.user.id);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ status: "success", results: user.wishlist.length, data: user.wishlist });
}

