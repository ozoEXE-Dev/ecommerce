import mongoose from "mongoose";
import "dotenv/config";

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
    },
    image: {
        type: mongoose.Schema.Types.String,
        required: true
    }
},{timestamps: true});


const setImageURL = doc => {
    const imageURL = `${process.env.HOST_NAME}/brands/${doc.image}`
    doc.image = imageURL;
}

brandSchema.post("init", (doc) => {
    setImageURL(doc);
})

brandSchema.post("save", doc=>{
    setImageURL(doc);
})

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;