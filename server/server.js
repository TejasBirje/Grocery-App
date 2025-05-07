import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import sellerRouter from "./routes/seller.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import addressRouter from "./routes/address.route.js";
import orderRouter from "./routes/order.route.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow Multiple Origins
const allowedOrigins = ['http://localhost:5173']

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("Hello")
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;