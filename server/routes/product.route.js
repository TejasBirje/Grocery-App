import express from "express";
import { addProduct, changeStock, productById, productList } from "../controllers/product.controller.js";
import { upload } from "../config/multer.js";
import { authSeller } from "../middlewares/seller.middleware.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array(['images']), authSeller, addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productById);
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;