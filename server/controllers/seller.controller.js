import jwt from "jsonwebtoken";

// Login Seller: /api/seller/login
export const sellerLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.cookie('sellerToken', token, {
                httpOnly: true,  // Prevents Javascript from accessing the cookie
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",  // protects from CSRF attack
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ success: true, message: "Seller Logged In Successfully" })
        }

        else {
            return res.json({ success: false, message: "Invalid Seller Credentials" })
        }
    } catch (error) {
        console.log("Error in seller Login controller: ", error);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// Seller isAuth: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        console.log("Error in isSellerAuth controller: ", error);
        res.json({ success: false, message: error.message });
    }
}

// Seller Logout: /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
        });

        return res.json({ success: true, message: "Seller Logged Out Successfully"})
    } catch (error) {
        console.log("Error in seller logout controller: ", error);
        return res.json({ success: false, message: error.message });
    }
}