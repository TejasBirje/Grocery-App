import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [ user, setUser ] = useState(null);
    const [ isSeller, setIsSeller ] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);

    // we can access these state variables in any component
    const value = {
        navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
};

export const useAppContext = () => {

    // so now we can use the "useContext" in any components and access the data in teh value object
    return useContext(AppContext);
}