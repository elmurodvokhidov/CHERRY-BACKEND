import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    // Token bor yoki yo'qligini aniqlash
    const token = req.headers.authorization;
    if (!token) return res.status(401).send("Token bo'lmaganligi sababli murojaat rad etildi!");

    // Token mavjud bo'lsa...
    jwt.verify(token, process.env.JWT_KEY, (error, user) => {
        if (error) res.status(403).json({ message: "Yaroqsiz token!" });
        req.user = user;
        // Keyingi middleware funksiyaga o'tkazish
        next();
    });
};
export const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Sizga buni qilishga ruxsat yo'q!");
        }
    });
};
export const verifyTokenAndAdmin = async (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Sizga buni qilishga ruxsat yo'q!");
        }
    });
};