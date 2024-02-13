import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import stripeRoutes from "./config/stripe.js";
import path from "path";

dotenv.config();
const app = express();

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// image storage engine
const storage = multer.diskStorage({ destination: './upload/images', filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`) });
const upload = multer({ storage: storage });

// creating upload endpoint for images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({ imgURL: `${process.env.PRODUCTION}/images/${req.file.filename}` })
});

// routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("api/orders", orderRoutes);
app.use("/api/checkout", stripeRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("mongodb successfully connected!");
        app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch(error => console.log("mongodb error", error.message))