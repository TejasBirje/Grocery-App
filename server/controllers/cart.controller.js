import User from "../models/user.model.js";

// Update user cartdata: /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.userId;
        
        await User.findByIdAndUpdate(userId, { cartItems });

        res.json({ success: true, message: "Cart Updated Successfully"})
    } catch (error) {
        console.log("Error in updateCart controller: ", error);
        res.json({ success: false, message: error.message });
    }
}