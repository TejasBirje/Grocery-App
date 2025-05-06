import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User: /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // before storing, hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name, email, password: hashedPassword,
        });

        // create jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d"});

        // add the token in the cookies
        res.cookie('token', token, {
            httpOnly: true,  // Prevents Javascript from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",  // protects from CSRF attack
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ 
            success: true, 
            user: {
                email: user.email, 
                name: user.name
            }
        });

    } catch (error) {
        console.log("Error in register controller: ", error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}

// Login User: /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) return res.json({ success: false, message: "All fields are required"});

        // find the user using the email
        const user = await User.findOne({ email });

        if(!user) {
            return res.json({ success: false, message: "User does not exist"});
        }

        // Compare the provided password and saved password (hashed)
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials"})
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d"});

        // add the token in the cookies
        res.cookie('token', token, {
            httpOnly: true,  // Prevents Javascript from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",  // protects from CSRF attack
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ 
            success: true, 
            user: {
                email: user.email, 
                name: user.name
            }
        });

    } catch (error) {
        console.log("Error in login controller: ", error);
        res.json({ success: false, message: error.message });
    }
}

// Check Auth: /api/user/is-auth
export const isAuth = async (req, res) => {
    try {

        // const { userId } = req.body.userId
        const userId = req.userId;

        console.log(userId);

        const user = await User.findById(userId).select("-password");   // exclude the password while getting

        return res.json({ success: true, user})
    } catch (error) {
        console.log("Error in isAuth controller: ", error);
        res.json({ success: false, message: error.message });
    }
}

// Logout: /api/user/logout
export const logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
        });

        return res.json({ success: true, message: "Logged Out Successfully"})
    } catch (error) {
        console.log("Error in logout controller: ", error);
        res.json({ success: false, message: error.message });
    }
}