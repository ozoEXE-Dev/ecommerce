import mongoose from "mongoose";
import "dotenv/config";
const categorySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        minlength: [3, "category name length should be between 3 to 32"],
        maxlength: [32, "category name length should be between 3 to 32"],
        required: [true, "category name is required"],
    },
    slug: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, "slug is required"],
        lowercase: true,
    },
    image: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, { timestamps: true });

const setImageURL = doc => {
    const imageURL = `${process.env.HOST_NAME}/categories/${doc.image}`
    doc.image = imageURL;
}

categorySchema.post("init", (doc) => {
    setImageURL(doc);
})

categorySchema.post("save", doc => {
    setImageURL(doc);
})


const Category = mongoose.model("Category", categorySchema);

export default Category;