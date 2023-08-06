import express from "express";
import { createCategory, fetchCategory } from "../controller/Category.js";
const categoryRouter = express.Router();
categoryRouter.get("/", fetchCategory)
    .post("/", createCategory);
export default categoryRouter;