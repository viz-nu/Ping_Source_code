import express from "express";
import config from "config";

import "./dbconnect.js";

const app = express();
app.use(express.json());
const port = config.get("PORT");

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



// teamRouter
import userRouter from "./controllers/users/index.js";
import taskRouter from "./controllers/tasks/index.js";
import OauthRouter from "./controllers/Oauthusers/index.js";
import payRouter from "./controllers/payments/index.js";
import teamRouter from "./controllers/teams/index.js";




app.use("/api/pay/", payRouter);
app.use("/api/user/", userRouter);
app.use("/api/team/", teamRouter);
app.use("/api/Oauth/", OauthRouter);
app.use("/api/task/", taskRouter);
app.listen(port, () => {
  console.log(`server started at ${port}`);
});

