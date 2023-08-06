import express from "express";
import { createOrder, fetchOrdersByUser, deleteOrder, updateOrder } from "../controller/Order.js"

const orderRouter = express.Router();
//  /orders is already added in base path
orderRouter.post('/', createOrder)
      .get('/', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)


export default orderRouter ;