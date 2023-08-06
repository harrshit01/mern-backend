import express from "express";
import { addToCart, deleteFromCart, fetchCartByUser, updateCart } from "../controller/Cart.js";

const cartRouter = express.Router();

cartRouter.get("/", fetchCartByUser)
    .post("/", addToCart)
    .delete("/:id",deleteFromCart)
    .patch("/:id",updateCart)

export default cartRouter;