import express from "express";
import { checkAuth,  createUser, loginUser, logout, resetPassword, resetPasswordRequest } from "../controller/Auth.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const passport = require('passport');


const authRouter = express.Router();

authRouter.post("/signup", createUser)
    .post("/login", passport.authenticate('local'), loginUser)
    .get('/check', passport.authenticate('jwt'), checkAuth)
    .get('/logout', logout)
    .post('/resetpasswordrequest', resetPasswordRequest)
    .post('/resetpassword', resetPassword);

export default authRouter;