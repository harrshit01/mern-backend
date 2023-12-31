import express from "express";
import { fetchUserByid, updateUser } from "../controller/User.js";

const userRouter = express.Router();

userRouter.get("/own", fetchUserByid)
    .patch("/:id", updateUser);

export default userRouter;