import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Joi from "joi";

export const register = async (req, res) => {
    try {
        const { fName, lName, email, password, avatar, isAdmin } = req.body;
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return res.status(400).json({ message: "Email manzili yaroqsiz!" });

        // Kiritilgan email manzilini bazadan tekshirish
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email allaqachon mavjud!" });

        // Kiritilgan yangi parolni hash-lash
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kiritilgan foydalanuvchi ma'lumotlarini bazaga qo'shish
        const newUser = await User({
            fName,
            lName,
            email,
            password: hashedPassword,
            avatar,
            isAdmin
        });

        // Yangi faoydalanuvchini bazaga saqlash
        await newUser.save();

        // Frontga javob qaytarish
        res.status(201).json({
            message: "Foydalanuvchi muvaffaqiyatli ro'yhatdan o'tdi!",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return res.status(400).json({ message: "Email manzili yaroqsiz!" });

        // Ma'lumotlar omboridan mavjud foydalanuvchini topish
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(400).json({ message: "Foydalanuvchi topilmadi!" });

        // Topilgan foydalanuvchini parolini, front-dan kelgan parol bilan solishtirish
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        // Parollar mos kelmasa...
        if (!isPasswordCorrect) return res.status(404).json({ message: "Parol noto'g'ri!" });

        // Yangi token generatsiya qilish
        const token = jwt.sign(
            {
                email: existingUser.email,
                id: existingUser._id,
                isAdmin: existingUser.isAdmin
            },
            process.env.JWT_KEY,
            { expiresIn: "25d" }
        );

        // Login bo'lgan foydalanuvchini va token qaytarish
        res.status(200).json({
            message: "Foydalanuvchi hisobiga muvaffaqiyatli kirdi!",
            data: existingUser, token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        // Kiritilgan ma'lumotlarni tekshirish
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Profilni yangilash
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "Berilgan id-ga mos ma'lumot topilmadi!" });

        // Front-ga yangilangan profilni qaytarish
        res.status(200).json({
            message: "Hisob ma'lumotlari muvaffaqiyatli yangilandi!",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteProfile = async (req, res) => {
    try {
        // Bazadan berilgan id bo'yicha foydalanuvchini topish va o'chirish
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        // Agar berilgan id bo'yicha foydalanuvchi topilmasa
        if (!deletedUser) return res.status(404).json({ message: "Foydalanuvchi ma'lumotlari topilmadi!" });

        // Front-ga javob qaytarish
        return res.status(200).json({ message: "Foydalanuvchi ma'lumotlari muvaffaqiyatli o'chirildi!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getUser = async (req, res) => {
    try {
        // Bazadan berilgan id bo'yicha foydalanuvchini topish
        const foundUser = await User.findById(req.params.id);
        // Agar berilgan id bo'yicha foydalanuvchi topilmasa
        if (!foundUser) return res.status(404).json({ message: "Foydalanuvchi ma'lumotlari topilmadi!" });

        // Front-ga javob qaytarish
        res.status(200).json({ data: foundUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Validate function
function validateUser(user) {
    const schema = Joi.object({
        fName: Joi.string().min(4).max(15).required(),
        lName: Joi.string().min(4).max(15).required(),
        email: Joi.string().max(50).required(),
        avatar: Joi.string(),
    });

    return schema.validate(user);
};