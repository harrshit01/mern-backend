import express from "express";
import { createBrand, fetchBrands } from "../controller/Brand.js";
const brandRouter = express.Router();

brandRouter.get("/", fetchBrands)
    .post("/", createBrand);

export default brandRouter;