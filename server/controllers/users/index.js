import express, { Router } from "express"
import config from "config"
import bcrypt from "bcrypt";
import userModel from "../../models/users.js";

import sendmail from "../../utils/sendmail.js";
import sendSMS from "../../utils/sendSMS.js";
import jwt from "jsonwebtoken";
import { userRegisterValidations, errorMiddleware, userLoginValidations } from "../../middlewares/validations.js";
import authMiddleware from "../../middlewares/auth.js";
const userRouter = express.Router();
let { JWT } = config.get("SECRET_KEYS")
userRouter.post("/register", userRegisterValidations(), errorMiddleware, async (req, res) => {
    try {
        const found = await userModel.findOne({ email: req.body.email })
        if (found) { return res.status(400).json({ error: "you have already registered" }); }
        const formData = new userModel(req.body)
        const hash = await bcrypt.hash(formData.password, 12)
        formData.password = hash;

        let emailToken = (Math.random() + 1).toString(16).substring(2);
        let smsToken = (Math.random() + 1).toString(16).substring(2);
        formData.verifyToken.email = emailToken
        formData.verifyToken.sms = smsToken
        await formData.save();
        //Email confirmation Logic
        sendmail(
            {
                subject: `Viz .tech - Email verification`,
                to: formData.email,
                body: `Hello ${formData.fname} 
                <br /><br />
                Welcome to Viz .tech. Please <a href='${config.get("URL")}api/user/verify/email/${emailToken}'>click here</a> to finish your sign up process.
                <br />
                <br />
                Thank you <br>
                Regards <br />
                <b>Team Viz .tech</b>
                `
            }
        )
        sendSMS(
            {

                to: `${formData.phone} `,
                body: `Hello ${formData.fname} 
                
                Welcome to Viz .tech. Please click on this link to finish your sign up process.
                ${config.get("URL")}api/user/verify/phone/${smsToken}
                
                
                Thank you,
                Regards 
                Team Viz .tech
                `
            }

        )
        let payload = {
            user_id: formData._id,
            email: formData.email,
            fname: formData.fname,
            pro: formData.pro,
            phone: formData.phone
        }
        let token = jwt.sign(payload, JWT, { expiresIn: "1h" })
        return res.status(200).json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });

    }
});


userRouter.post("/login", userLoginValidations(), errorMiddleware, async (req, res) => {
    try {
        const userData = await userModel.findOne({ email: req.body.email })
        if (!userData) { return res.status(400).json({ error: "entered email does not exist. please try again" }); }
        let match = await bcrypt.compare(req.body.password, userData.password)
        if (!match) { return res.status(400).json({ error: "invalid credintials. please try again" }); }
        let payload = {
            user_id: userData._id,
            email: userData.email,
            fname: userData.fname,
            pro:userData.pro,
            phone:userData.phone
        }
        let token = jwt.sign(payload, JWT, { expiresIn: "1h" })
        return res.status(200).json({ token });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });

    }
});

userRouter.get("/verify/email/:token",
    async (req, res) => {
        try {
            let token = req.params.token;
            const userData = await userModel.findOne({ "verifyToken.email": token })
            if (userData.userVerified.email) {
                return res.status(200).send("<h1>Email already verified.</h1>")
            }
            userData.userVerified.email = true;
            await userData.save();
            res.status(200).send("<h1>Email verified Successfully.</h1>")


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }
)

userRouter.get("/verify/phone/:token",
    async (req, res) => {
        try {
            let token = req.params.token;
            const userData = await userModel.findOne({ "verifyToken.sms": token })
            if (userData.userVerified.sms) {
                return res.status(200).send("<h1>phone already verified.</h1>")
            }
            userData.userVerified.sms = true;
            await userData.save();
            res.status(200).send("<h1>phone verified Successfully.</h1>")
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }
)
userRouter.get("/auth", async (req, res) => {
    try {

        let decoded = jwt.verify(req.headers["auth-token"], JWT);

        res.status(200).json({ "userDetails": decoded });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Unauthorised or Token Expired' });
    }
});
userRouter.post("/rstpwd", async (req, res) => {
    try {

        const userData = await userModel.findOne({ email: req.body.emailId })
        if (!userData) { return res.status(400).json({ error: "entered email does not exist. please try again" }); }
        if (req.body.password1 !== req.body.password2) { return res.status(400).json({ error: "passwords doesn't match" }); }
        const hash = await bcrypt.hash(req.body.password1, 12);
        userData.password = hash;
        await userData.save();
        res.status(200).json({ success: "password reset successfull" });

    } catch (error) {
        console.log(error);
    }
});

userRouter.post("/otp", (req, res) => {
    let otp = (Math.random() + 1).toString().substring(2, 8);
    // console.log(req.body.email);
    sendmail(
        {
            subject: `Viz.tech - 2-step verification`,
            to: req.body.email,
            body: `Hello ${req.body.fname} 
            <br /><br />
            Welcome to Viz.tech. Please to finish enter <b>${otp}</b> otp to finish your sign up process.
            <br />
            <br />
            Thank you <br>
            Regards <br />
            <b>Team Viz .tech</b> `
        }
    )
    res.status(200).json({ pswd: otp })

});
userRouter.put("/edits", authMiddleware, async(req,res)=>{
    // {
    //             phone: '+919959964639'
    // } {
    //     user_id: '63fb516bf445a9d6dbd51f7b',
    //         email: 'vishnu.teja101.vt@gmail.com',
    //             fname: 'vishnu teja',
    //                 pro: true,
    //                     iat: 1679676682,
    //                         exp: 1679680282
    // }
    // 
try {
    // console.log(req.body, req.user);
    const userData = await userModel.findById(req.user.user_id);

    if ( req.body.phone != userData.phone) {
        userData.phone = req.body.phone
    }
    await userData.save()
    res.status(200).json({ success: "Profile Details updated successfully" });
} catch (error) {
    console.log(error);
}
    

})


export default userRouter;