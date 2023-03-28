import userModel from "../../models/users.js"
import jwt from "jsonwebtoken";
import express, { Router } from "express"
import config from "config"
const { JWT, Google_Key } = config.get("SECRET_KEYS")

const OauthRouter = express.Router();

OauthRouter.get('/oauthkey', function (req, res) {
    res.status(200).json({ key: Google_Key })
});


OauthRouter.post("/oauthLogin", async (req, res) => {
    try {

        var userData = await userModel.findOne({ email: req.body.email })
        if (!userData) {
            const { name, email } = req.body
            var userData = new userModel({ fname: name, email: email, phone: "", userVerified: { email: true } })
            // console.log(userData);
            await userData.save()
        }

        let payload = {
            user_id: userData._id,
            email: userData.email,
            fname: userData.fname,
            pro: userData.pro,
            phone: userData.phone
        }
        let token = jwt.sign(payload, JWT, { expiresIn: "1h" })
        return res.status(200).json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default OauthRouter