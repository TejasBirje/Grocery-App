import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // function to fetch dummy products from assets
    const fetchProducts = async () => {
        setProducts(dummyProducts);
    }

    // add product to cart
    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Added to Cart")
    }

    // update cart item quantity
    const updateCartItems = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated");
    }

    // remove from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success("Removed from Cart");
    }

    // calculate number of items in cart
    const getCartCount = () => {
        let totalCount = 0;
        for(const it in cartItems) {
            totalCount += cartItems[it];
        }

        return totalCount;
    }

    // get total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;

        for(const it in cartItems) {
            let itemInfo = products.find((product) => product._id === it);
            if(cartItems[it] > 0) {
                // total = price * quantity
                totalAmount += itemInfo.offerPrice * cartItems[it];
            }
        }

        return Math.floor(totalAmount * 100)/100;
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    // we can access these state variables in any component
    const value = {
        navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, 
        products, setProducts, currency, addToCart, updateCartItems, removeFromCart, cartItems,
        searchQuery, setSearchQuery, getCartAmount, getCartCount
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
};

export const useAppContext = () => {

    // so now we can use the "useContext" in any components and access the data in teh value object
    return useContext(AppContext);
}