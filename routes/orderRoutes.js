import express from "express";
const router = express.Router();
import {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuth
} from "../middleware/auth.js";
import {
    addToOrder,
    deleteFromOrder,
    getAllOrderItems,
    getUserOrder,
    updateOrder
} from "../controller/orderController.js";


router.post("/", verifyToken, addToOrder);
router.put("/:id", verifyTokenAndAuth, updateOrder);
router.delete("/:id", verifyTokenAndAdmin, deleteFromOrder);
router.get("/find/:userId", verifyTokenAndAuth, getUserOrder);
router.get("/", verifyTokenAndAdmin, getAllOrderItems);


export default router;