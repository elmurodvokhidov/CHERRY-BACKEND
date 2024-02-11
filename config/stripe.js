import express from "express";
import Stripe from "stripe";
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json({ message: stripeErr });
            } else {
                res.status(200).json(stripeRes);
            }
        }
    );
});

export default router;