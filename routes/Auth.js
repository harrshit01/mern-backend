import express from "express";
import { createUser, loginUser } from "../controller/Auth.js";

const authRouter = express.Router();

authRouter.post("/signup", createUser)
    .post("/login", loginUser)

export default authRouter;