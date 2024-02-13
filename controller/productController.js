import Product from "../models/product.js";
import Joi from "joi";

export const getAllProducts = async (req, res) => {
    try {
        // query string
        const queryCategory = req.query.category;
        // Bazadan barcha mahsulotlarni olish, kategoriya bo'yicha filterlash
        let products;
        if (queryCategory) {
            products = await Product.find({
                category: {
                    $in: [queryCategory]
                }
            });
        }
        else {
            products = await Product.find();
        }

        // Agar mahsulotlar topilmasa
        if (!products) return res.status(404).json({ message: "Mahsulot topilmadi!" });

        // Front-ga javob qaytarish
        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getProduct = async (req, res) => {
    try {
        // Bazadan berilgan id bo'yicha mahsulotni topish
        const foundProduct = await Product.findById(req.params.id);
        // Agar berilgan id bo'yicha mahsulot topilmasa
        if (!foundProduct) return res.status(404).json({ message: "Mahsulot topilmadi!" });

        // Front-ga javob qaytarish
        res.status(200).json({ data: foundProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const addNewProduct = async (req, res) => {
    try {
        // Kiritilgan ma'lumotlarni tekshirish
        const { error } = validateProduct(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Yangi mahsulot ma'lumotlarini saqlash
        const newProduct = await Product(req.body);
        await newProduct.save();

        // Front-ga javob qaytarish
        res.status(201).json({
            message: "Yangi mahsulot muvaffaqiyatli yaratildi!",
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        // Kiritilgan ma'lumotlarni tekshirish
        const { error } = validateProduct(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Mahsulotni yangilash
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Berilgan id-ga mos mahsulot topilmadi!" });

        // Front-ga yangilangan mahsulotni qaytarish
        res.status(200).json({
            message: "Mahsulot muvaffaqiyatli yangilandi!",
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        // Bazadan berilgan id bo'yicha mahsulotni topish va o'chirish
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        // Agar berilgan id bo'yicha mahsulot topilmasa
        if (!deletedProduct) return res.status(404).json({ message: "Mahsulot topilmadi!" });

        // Front-ga javob qaytarish
        return res.status(200).json({ message: "Mahsulot muvaffaqiyatli o'chirildi!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Validate function
function validateProduct(product) {
    const schema = Joi.object({
        title: Joi.string().required(),
        img: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string(),
        color: Joi.string(),
        discount: Joi.number(),
        inStock: Joi.boolean()
    });

    return schema.validate(product);
};