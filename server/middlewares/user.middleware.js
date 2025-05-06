import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return res.json({ success: false, message: "Unauthorized"});
    }

    try {
        // decode the token to extract the user ID
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // add the extracted user ID into the request body
        if(tokenDecode.id) {
            console.log(tokenDecode.id)

            // req.body.userId = tokenDecode.id;
            req.userId = tokenDecode.id;
        } 
        else {
            return res.json({ success: false, message: "Unauthorized"});
        }

        next();
    } catch (error) {
        console.log("Error in authUser middleware: ", error);
        return res.json({ success: false, message: error.message });
    }
}