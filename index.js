import express from "express";
import cors from "cors";
const server = express();

import mongoose from "mongoose";
import productRouter from "./routes/Product.js";
import brandRouter from "./routes/Brand.js";
import categoryRouter from "./routes/Category.js";
import userRouter from "./routes/User.js";
import authRouter from "./routes/Auth.js";
import cartRouter from "./routes/Cart.js";
import orderRouter from "./routes/Order.js";

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
        console.log("db connected")
    } catch (error) {
        console.log(error);
    }
}
main();

server.use(cors({
    exposedHeaders:['X-Total-Count']
}))
server.use(express.json());
server.use("/products",productRouter);
server.use("/brands",brandRouter);
server.use("/category",categoryRouter);
server.use("/user",userRouter);
server.use("/auth",authRouter);
server.use("/cart",cartRouter);
server.use("/orders",orderRouter);


server.listen(8080, () => {
    console.log("Server is running");
});