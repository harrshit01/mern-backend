import express from "express";
const server = express();

import mongoose from "mongoose";
import productRouter from "./routes/Product.js";
import brandRouter from "./routes/Brand.js";
import categoryRouter from "./routes/Category.js";

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

server.use(express.json());
server.use("/products",productRouter);
server.use("/brands",brandRouter);
server.use("/category",categoryRouter);


server.listen(8080, () => {
    console.log("Server is running");
});