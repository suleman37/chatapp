import { useState } from "react";
import { ToastContainer } from "react-toastify";
import SignUp from "./signup";
import SignIn from "./signin";

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <ToastContainer />
            <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-800 shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl">
                <div className="p-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Hello!</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Please {isSignUp ? "signup" : "login"} to continue
                    </p>
                    {isSignUp ? (
                        <SignUp formData={formData} onChange={handleChange} />
                    ) : (
                        <SignIn formData={formData} onChange={handleChange} />
                    )}

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-t border-gray-600" />
                        <span className="mx-2 text-gray-500">or</span>
                        <hr className="flex-grow border-t border-gray-600" />
                    </div>

                    <div className="flex justify-center space-x-4 mb-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">F</button>
                        <button className="bg-sky-400 text-white px-4 py-2 rounded-full">T</button>
                    </div>

                    <p className="text-sm text-center text-gray-400">
                        {isSignUp ? "I'm already a member!" : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>

                <div className="bg-blue-600 text-white flex flex-col items-center justify-center p-10">
                    <div className="text-6xl mb-4">🏃</div>
                    <h2 className="text-2xl font-bold mb-2">Chat Race</h2>
                    <p className="text-sm">{isSignUp ? "Already have an account?" : "New here?"}</p>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-blue-600 transition-colors"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;