import express from "express";
import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/seller.controller.js";
import { authSeller } from "../middlewares/seller.middleware.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/is-auth", authSeller, isSellerAuth)
sellerRouter.get("/logout", sellerLogout);

export default sellerRouter;