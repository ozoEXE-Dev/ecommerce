import AppError from "../errors/AppError.js";
import * as cartService from "../services/cart_service.js"



// @desc add product to cart
// @route post /api/v1/cart
// @access private
export const addProductToCart = async (req, res, next) => {
    const isAdded = await cartService.addProductToCart(req);
    if (isAdded) {
        res.status(201).json({ status: "success", message: "product added to the cart" })
    } else {
        res.status(400).json({ status: "fail", message: "couldn't add product to the cart" })
    }
}

// @desc get logged user cart
// @route get /api/v1/cart/me
// @access private
export const getLoggedUserCart = async (req, res, next) => {
    const cart = await cartService.getLoggedUserCart(req.user.id);
    if (!cart) {
        throw new AppError(404, "there is no cart for this user")
    }

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    })
}

// @desc delete cart item
// @route delete /api/v1/cart/:id
// @access private
export const deleteCartItem = async (req, res, next) => {
    const cart = await cartService.deleteCartItem(req);
    res.status(200).json({ status: "success", message: "item deleted", data: cart });
}


// @desc clear cart
// @route delete /api/v1/cart/clear
// @access private
export const clearCart = async (req, res, next) => {
    await cartService.clearCart(req);
    res.status(200).json({ status: "success", message: "cart cleared" })
}

// @desc update quantity
// @route patch /api/v1/cart/:id
// @access private
export const updateQuantity = async (req, res, next) => {
    const cart = await cartService.updateQuantity(req);
    res.status(200).json({ status: "success", message: "quantity updated", data: cart })
}

// @desc apply coupon
// @route post /api/v1/cart/coupon
// @access private
export const applyCoupon = async (req, res, next) => {
    const cart = await cartService.applyCoupon(req);
    res.status(200).json({ status: "success", message: "coupon applyed", data: cart })
}