import AppError from "../errors/AppError.js";
import * as addressService from "../services/address_service.js"


// @desc add an address
// @route post /api/v1/addresses
// @access private
export const addAddress = async (req, res, next) => {
    const user = await addressService.addAddress(req);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ data: user.addresses });
}

// @desc delete an address
// @route delete /api/v1/addresses/:id
// @access private
export const deleteAddress = async (req, res, next) => {
    const user = await addressService.deleteAddress(req);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ status: "success", results: user.addresses.length, data: user.addresses });
}

// @desc get the current user's addresses
// @route get /api/v1/addresses/me
// @access private
export const getMyaddress = async (req, res, next) => {
    const user: any = await addressService.getMyAddresses(req.user.id);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ status: "success", results: user.addresses.length, data: user.addresses });
}

// @desc update an address
// @route patch /api/v1/addresses/:id
// @access private
export const updateAddress = async (req, res, next) => {
    const user = await addressService.updateAddress(req);
    console.log(user);
    if (!user) {
        throw new AppError(404, "user not found")
    }
    res.status(200).json({ status: "success", results: user.addresses.length, data: user.addresses });
}