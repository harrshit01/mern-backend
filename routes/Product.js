import express from "express";
import { createProduct, fetchAllProducts, fetchProductById, updateProduct } from "../controller/Product.js";
const productRouter = express.Router();
productRouter.get("/", fetchAllProducts)
    .get("/:id", fetchProductById)
    .post("/", createProduct)
    .patch("/:id", updateProduct);
export default productRouter;