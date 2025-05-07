import React from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {
        
        try {
            e.preventDefault();

            const { data } = await axios.post(`/api/user/${state}`, {
                name, email, password
            })

            if(data.success) {
                navigate("/");
                setUser(data.user);
                setShowUserLogin(false);
                toast.success("Logged In Successfully");
            } else {
                console.log("Error Creating User", data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div onSubmit={onSubmitHandler} onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <div onClick={(e) => e.stopPropagation()} className="flex flex-row m-auto rounded-lg shadow-xl border border-gray-200 bg-white">
                <form onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px]">
                    <p className="text-3xl font-medium m-auto">
                        <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                    {state === "register" && (
                        <div className="w-full">
                            <p>Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder="e.g. John Doe"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="text"
                                required
                            />
                        </div>
                    )}
                    <div className="w-full">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="e.g. john@gmail.com"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="email"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <p>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="******"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="password"
                            required
                        />
                    </div>
                    {state === "register" ? (
                        <p>
                            Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                        </p>
                    ) : (
                        <p>
                            Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                        </p>
                    )}
                    <button className="bg-primary hover:primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        {state === "register" ? "Create Account" : "Login"}
                    </button>
                </form>

                <div className="w-1 bg-primary/20 h-full"></div>

                <div className="hidden md:block">
                    <img className="h-full w-96 object-cover rounded-r-lg" src={assets.login_image} alt="login illustration" />
                </div>
            </div>
        </div>
    );
};

export default Login