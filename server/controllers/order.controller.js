import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import stripe from "stripe";
import User from "../models/user.model.js";

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
                    currency: "inr",
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

// Stripe Webhook to verify payment: /stripe
export const stripeWebhooks = async (request, response) => {
    
    // Create Stripe Instance
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const payment_intent = event.data.object;
            const paymentIntentId = payment_intent.id;

            // getting the session meta data 

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const { orderId, userId } = session.data[0].metadata;

            // Make isPaid true for it
            await Order.findByIdAndUpdate(orderId, { isPaid: true });

            //clear cart items
            await User.findByIdAndUpdate(userId, { cartItems: {}})
            break;
        }
        case "payment_intent.payment.failed": {
            const payment_intent = event.data.object;
            const paymentIntentId = payment_intent.id;

            // getting the session meta data 

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const { orderId } = session.data[0].metadata;

            // delete the payment as it has failed
            await Order.findByIdAndDelete(orderId);
            break;
        }  
        
        default:
            console.error(`Unhandled event type: ${event.type}`);
            break;
    }

    response.json({ received: true })
}