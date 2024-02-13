import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String
        },
        color: {
            type: String,
        },
        price: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        inStock: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("product", productSchema);