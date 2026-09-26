import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: { 
        type: mongoose.Schema.Types.String,
        unique: true,
        minlength: [3,"brand name length should be between 3 to 32"],
        maxlength: [32, "brand name length should be between 3 to 32"],
        required:  [true, "brand name is required"],
    },
    slug: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, "slug is required"],
        lowercase: true,
    }
},{timestamps: true});

const Brand = mongoose.model("brand", brandSchema);

export default Brand;