import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name required'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'email required'],
            unique: true,
            lowercase: true,
        },
        phone: String,
        profileImg: String,

        password: {
            type: String,
            required: [true, 'password required'],
            minlength: [6, 'Too short password'],
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'manager', 'admin'],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        wishlist: [
            {
                ref: "Product",
                type: mongoose.Schema.Types.ObjectId,
                unique: true,
            }
        ],
        addresses: [
            {
                alias: String,
                details: String,
                phone: String,
                city: String,
                postalCode: String,
            }
        ]
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
})

const setImageURL = doc => {
    const imageURL = `${process.env.HOST_NAME}/users/${doc.profileImg}`
    doc.profileImg = imageURL;
}

userSchema.post("init", (doc) => {
    setImageURL(doc);
})

userSchema.post("save", doc=>{
    setImageURL(doc);
})
const User = mongoose.model('User', userSchema);

export default User;