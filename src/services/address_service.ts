import { body } from "express-validator";
import User from "../models/user_model.js"


export const addAddress = async (req) => {
    const { details, alias, postalCode, phone, city } = req.body;
    return await User.findByIdAndUpdate(req.user.id, { $addToSet: { addresses: { details, alias, postalCode, phone, city } } }, { returnDocument: "after" })
}

export const deleteAddress = async (req) => {
    return await User.findByIdAndUpdate(req.user.id, { $pull: { addresses: { _id: req.params.id } } }, { returnDocument: "after" })
}

export const updateAddress = async (req) => {

    const allowedFields = ["details", "alias", "postalCode", "phone", "city"];

    const updates = Object.fromEntries(
        Object.entries(req.body).filter(
            ([key, value]) => allowedFields.includes(key) && value !== undefined
        )
    );

    const updatedUser = await User.findOneAndUpdate(
        {
            _id: req.user.id,
            "addresses._id": req.params.id,
        },
        {
            $set: Object.fromEntries(
                Object.entries(updates).map(([key, value]) => [
                    `addresses.$.${key}`,
                    value,
                ])
            ),
        },
        { returnDocument: "after", runValidators: true }
    );
    return updatedUser;
}

export const getMyAddresses = (id) => {
    return User.findById(id).select("addresses")
}