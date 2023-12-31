import { invoiceTemplate, sendMail } from "../common.js";
import { Order } from "../model/Order.js";
import { User } from "../model/User.js";

export const fetchOrdersByUser = async (req, res) => {
    const id = req.user.id;
    try {
        const orders = await Order.find({ user: id });
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};

export const createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
        const doc = await order.save();
        const user = await User.findById(order.user)
        // we can use await for this also 
        sendMail({to:user.email,html:invoiceTemplate(order),subject:'Order Received' })
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndDelete(id);
        res.status(200).json(order);
    } catch (err) {
        res.status(400).json(err);
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(order);
    } catch (err) {
        res.status(400).json(err);
    }
};
export const fetchAllOrders = async (req, res) => {
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    // TODO : we have to try with multiple category and brands after change in front-end
    let query = Order.find({deleted:{$ne:true}});
    let totalOrdersquery = Order.find({deleted:{$ne:true}});

   
    //TODO : How to get sort on discounted Price not on Actual price
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalOrdersquery.count().exec();
    console.log({ totalDocs });

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    } catch (err) {
        res.status(400).json(err);
    }
};