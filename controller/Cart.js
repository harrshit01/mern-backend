import { Cart } from "../model/Cart.js";

export const fetchCartByUser = async (req, res) => {
    const { user } = req.query;
    try {
        const cartItems = await Cart.find({ user: user }).populate('product').populate('user');
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(400).json(err);
    }
};

export const addToCart = async (req, res) => {

    const cart = new Cart(req.body);
    try {
        const doc = await cart.save();
        const result = await doc.populate('product');
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
};
export const updateCart = async (req, res) => {

    const { id } = req.params;
    try {
        const doc = await Cart.findByIdAndUpdate(id, req.body, { new: true });
        const result = await doc.populate('product');
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
};
export const deleteFromCart = async (req, res) => {

    const { id } = req.params;
    try {
        const doc = await Cart.findByIdAndDelete(id)
        res.status(200).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};