import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.model.js";

// Add Product: /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        // an array of images uploaded by user
        const images = req.files;

        // contains uploaded image urls
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image'})
                return result.secure_url;
            })
        )

        await Product.create({
            ...productData, 
            image: imagesUrl
        })

        res.json({ success: true, message: "Product Added Successfully"})

    } catch (error) {
        console.log("Error in addProduct controller: ", error);
        res.json({ success: false, message: error.message })
    }
}

// Get Product List: /api/product/list
export const productList = async (req, res) => {
    try {

        // get all products, hence we provided empty object so it gets everything
        const products = await Product.find({});

        res.json({ success: true, products})
    } catch (error) {
        console.log("Error in productList controller: ", error);
        res.json({ success: false, message: error.message })
    }
}

// Get a product by ID: /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await Product.findById(id);
        res.json({ success: true, product });
    } catch (error) {
        console.log("Error in productById controller: ", error);
        res.json({ success: false, message: error.message })
    }
}

// Change stock: /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;

        await Product.findByIdAndUpdate(id, {inStock});
        res.json({ success: true, message: "Stock Updated" });
    } catch (error) {
        console.log("Error in changeStock controller: ", error);
        res.json({ success: false, message: error.message })
    }
}