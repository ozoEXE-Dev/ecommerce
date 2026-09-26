import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { 
        type: mongoose.Schema.Types.String,
        unique: true,
        minlength: [3,"category name length should be between 3 to 32"],
        maxlength: [32, "category name length should be between 3 to 32"],
        required:  [true, "category name is required"],
    },
    slug: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, "slug is required"],
        lowercase: true,
    }
},{timestamps: true});

const Category = mongoose.model("category", categorySchema);

export default Category;