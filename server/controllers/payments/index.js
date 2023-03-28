import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import userModel from "../../models/users.js"
import express, { Router } from "express"
import config from "config";
import Stripe from 'stripe';
import authMiddleware from "../../middlewares/auth.js"
import User from "../../models/users.js";
const { Secret_key,successUrl,cancelUrl } = config.get("STRIPE_PAYMENTS")
let { JWT } = config.get("SECRET_KEYS")
const stripe = new Stripe(`${Secret_key}`);
const payRouter = express.Router();

payRouter.post('/userToPro', authMiddleware ,async function  (req, res) {
    try {
        const userData = await User.findById(req.user.user_id);
        userData.pro=true;
        await userData.save()
        let payload = {
            user_id: userData._id,
            email: userData.email,
            fname: userData.fname,
            pro:userData.pro
        }

        let token = jwt.sign(payload, JWT, { expiresIn: "1h" })
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
    }
});

payRouter.post('/checkout', authMiddleware ,async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Ping Teams',
                        },
                        unit_amount: 500,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        // console.log(session);
        return res.status(200).json({ url: session.url });
        
    } catch (error) {
        console.log(error)
    }

})

export default payRouter