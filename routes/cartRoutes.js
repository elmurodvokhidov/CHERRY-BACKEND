import express from "express";
const router = express.Router();
import {
    addToCart,
    updateCart,
    deleteFromCart,
    getUserCart,
    getAllCartItems
} from "../controller/cartController.js";
import {
    verifyToken,
    verifyTokenAndAuth,
    verifyTokenAndAdmin
} from "../middleware/auth.js";


router.post("/", verifyToken, addToCart);
router.put("/:id", verifyTokenAndAuth, updateCart);
router.delete("/:id", verifyTokenAndAuth, deleteFromCart);
router.get("/find/:userId", verifyTokenAndAuth, getUserCart);
router.get("/", verifyTokenAndAdmin, getAllCartItems);


export default router;