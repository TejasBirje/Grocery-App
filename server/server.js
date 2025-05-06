import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import sellerRouter from "./routes/seller.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connectDB();
});

export default app;