import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Object,
        default: {},
    }
}, {minimize: false});

// if User model is already available, use it, otherwise make the model
const User = mongoose.model("User", userSchema);

export default User;