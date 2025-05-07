import express from "express";
import { authUser } from "../middlewares/user.middleware.js";
import { getAllOrders, getUserOrders, placeOrderCOD } from "../controllers/order.controller.js";
import { authSeller } from "../middlewares/seller.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;