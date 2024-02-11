import Order from "../models/order.js";

export const addToOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        res.status(200).json({ data: savedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.status(200).json({ data: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteFromOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Mahsulot muvaffaqiyatli o'chirildi!" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getUserOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ userId: req.params.userId });
        if (!order) return res.status(404).json({ message: "Ma'lumot topilmadi!" });

        res.status(200).json({ data: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getAllOrderItems = async (req, res) => {
    try {
        const orders = await Order.find();
        if (orders.length === 0) return res.status(404).json({ message: "Mahsulot topilmadi!" });

        res.status(200).json({ data: orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};