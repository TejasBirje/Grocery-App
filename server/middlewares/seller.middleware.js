import jwt from "jsonwebtoken";

export const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.json({
            success: false, message: "Unauthorized"
        })
    }

    try {
        // decode the token to extract the user ID
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

        // add the extracted user ID into the request body
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            console.log(tokenDecode.email)

            next();
        }
        else {
            return res.json({ success: false, message: "Unauthorized" });
        }

        next();
    } catch (error) {
        console.log("Error in authSeller middleware: ", error);
        return res.json({ success: false, message: error.message });
    }
}