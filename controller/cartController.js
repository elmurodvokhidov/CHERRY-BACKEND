import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        const savedCart = await newCart.save();

        res.status(200).json({ data: savedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.status(200).json({ data: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteFromCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Savatdan mahsulot muvaffaqiyatli o'chirildi!" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: "Ma'lumot topilmadi!" });

        res.status(200).json({ data: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getAllCartItems = async (req, res) => {
    try {
        const carts = await Cart.find();
        if (carts.length === 0) return res.status(404).json({ message: "Mahsulot topilmadi!" });

        res.status(200).json({ data: carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};