import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SignIn = ({ formData, onChange }) => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.onopen = () => {
                console.log("WebSocket connection established");
            };
            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
            return () => {
                socket.close();
            };
        }
    }, [socket]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                const token = localStorage.getItem("token");
                console.log("Token from local storage:", token);
                toast.success("Login successful!", {
                    onClose: () => {
                        setSocket(new WebSocket(`ws://localhost:8001/ws?token=${token}`));
                        navigate("/chat");
                    }
                });
            } else {
                toast.error(data.message || "Login failed!");
            }
        } catch (error) {
            toast.error("Error logging in!");
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Sign In
            </button>
        </form>
    );
};

export default SignIn;