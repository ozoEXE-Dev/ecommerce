import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        minlength: [2, "subcategory name must be between 2 and 32"],
        maxlength: [32, "subcategory name must be between 2 and 32"],
        required: true,
        trim: true,
    },
    slug: {
        lowercase: true,
        required: true,
        unique: true,
        type: mongoose.Schema.Types.String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    }

}, { timestamps: true });

const Subcategory = mongoose.model("subcategory", subcategorySchema);
export default Subcategory;