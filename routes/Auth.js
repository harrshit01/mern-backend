import express from "express";
import { checkUser, createUser, loginUser } from "../controller/Auth.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const passport = require('passport');


const authRouter = express.Router();

authRouter.post("/signup", createUser)
    .post("/login", passport.authenticate('local'), loginUser)
    .get('/check',passport.authenticate('jwt'), checkUser);

export default authRouter;