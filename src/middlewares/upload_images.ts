import multer from "multer";
import AppError from "../errors/AppError.js";

const multerOptions = () => {
    const memoryStorage = multer.memoryStorage();
    const filter = (req, file: Express.Multer.File, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            cb(new AppError(400, "only images allowed"), false);
        }
    }
    return multer({ storage: memoryStorage, fileFilter: filter })
}

export const uploadSingleImage = (name) => {
  return multerOptions().single(name);
}

export const uploadMixOfImages = (fields)=>{
    return multerOptions().fields(fields);
}

