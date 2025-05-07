import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import stripe from "stripe";

// Place Order Cash On Delivery (COD): /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        if (!address || !items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        // calculate total amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        // add 2% tax
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully" })

    } catch (error) {
        console.log("Error in placeOrderCOD controller: ", error);
        return res.json({ success: false, message: error.message });
    }
}

// Get orders by User ID: /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },
                { paymentType: "Online" },
                { isPaid: "true" }
            ]
        }).populate("items.product address").sort({ createdAt: -1 });  // latest order first

        res.json({ success: true, orders })
    } catch (error) {
        console.log("Error in getUserOrders controller: ", error);
        return res.json({ success: false, message: error.message });
    }
}

// Get all orders (for seller) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentType: "COD" },
                { paymentType: "Online" },
                { isPaid: "true" }
            ]
        }).populate("items.product address").sort({ createdAt: -1 });

        res.json({ success: true, orders })
    } catch (error) {
        console.log("Error in getAllOrders controller: ", error);
        return res.json({ success: false, message: error.message });
    }
}

// Place Stripe Order: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!address || !items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        let productData = [];

        // calculate total amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        // add 2% tax
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // Create Stripe Instance
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },
                quantity: item.quantity,
            }
        });

        // Create Stripe Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })
        
        // in response we will give either success url or cancel url
        return res.json({ success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message});
    }
}