import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"));
        await mongoose.connect(`${process.env.MONGO_URI}/grocery`);
    } catch (error) {
        console.log("Error Connecting to DB: ", error);
    }
}

export default connectDB;