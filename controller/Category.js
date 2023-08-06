import { Category } from "../model/Category.js"

export const fetchCategory = async (req, res) => {
    try {
        const Categories = await Category.find({}).exec();
        res.status(201).json(Categories);

    } catch (error) {
        res.status(400).json(error);

    }
}
export const createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        const doc = await category.save();
        res.status(201).json(doc);

    } catch (error) {
        res.status(400).json(error);


    }
}