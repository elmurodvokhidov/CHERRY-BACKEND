import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20
        },
        lName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 50
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("user", userSchema);