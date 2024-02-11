import express from "express";
const router = express.Router();
import {
    verifyTokenAndAdmin,
    verifyTokenAndAuth
} from "../middleware/auth.js";
import {
    login,
    register,
    updateProfile,
    deleteProfile,
    getUser
} from "../controller/userController.js";


router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", verifyTokenAndAuth, updateProfile);
router.delete("/delete/:id", verifyTokenAndAuth, deleteProfile);
router.get("/:id", verifyTokenAndAdmin, getUser);


export default router;