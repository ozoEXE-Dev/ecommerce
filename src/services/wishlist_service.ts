import User from "../models/user_model.js"


export const addProductToWishlist = async (req) => {
    return await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: req.body.product } }, { returnDocument: "after" })
}

export const deleteProductFromWishList = async (req) => {
    return await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: req.params.id } }, { returnDocument: "after" })
}

export const getMyWishlist = (id) => {
    return User.findById(id).select("wishlist -_id").populate("wishlist")
}