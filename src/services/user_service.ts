import User from "../models/user_model.js";
import ApiFeatures from "../utils/api_features.js";
import bcrypt from "bcrypt"

export const createUser = (body) => {
    const { name, slug, email, phone, profileImg, password, role, active } = body;
    return User.create({ name, slug, email, phone, profileImg, password, role, active })
}

export const userSignup = (body)=>{
    return User.create({ name: body.name, email: body.email, password: body.password });
}

export const getUsers = async (query) => {
    const documentsCount = await User.countDocuments();
    const apiFeatures = new ApiFeatures(query, User.find());
    apiFeatures.filter().search().fields().sort().paginate(documentsCount);
    const users = await apiFeatures.mongooseQuery;
    return { results: users.length, paginationResults: apiFeatures.pagination, data: users };
}

export const getUser = (id: string) => {
    return User.findById(id);
}

export const getUserByEmail = (email) => {
    return User.findOne({ email })
}


export const updateUser = (id: string, body) => {
    return User.findOneAndUpdate({ _id: id }, { name: body.name, slug: body.slug, email: body.email, phone: body.phone, profileImg: body.profileImg, role: body.role, active: body.active }, { returnDocument: "after" });
}

export const updateLoggedUser = (id: string, body) => {
    return User.findOneAndUpdate({ _id: id }, { name: body.name, slug: body.slug, email: body.email, phone: body.phone, profileImg: body.profileImg,}, { returnDocument: "after" });
}

export const deleteLoggedUser = (id:string)=>{
    return User.findByIdAndUpdate(id,{active: false},{returnDocument: "after"});
}

export const changeUserPassword = async (id: string, body) => {
    return User.findByIdAndUpdate(id, { password: await bcrypt.hash(body.password, 12), passwordChangedAt: Date.now() }, { returnDocument: "after" })
}

export const deleteUser = (id: string,) => {
    return User.findByIdAndDelete(id);
}