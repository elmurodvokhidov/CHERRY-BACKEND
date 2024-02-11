import express from "express";
const router = express.Router();
import { verifyTokenAndAdmin } from "../middleware/auth.js";
import {
    addNewProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct
} from "../controller/productController.js";

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/create", verifyTokenAndAdmin, addNewProduct);
router.put("/update/:id", verifyTokenAndAdmin, updateProduct);
router.delete("/delete/:id", verifyTokenAndAdmin, deleteProduct);

export default router;