import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignIn = ({ formData, onChange }) => {
    const navigate = useNavigate();

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
            console.log("Response Data:", data);

            if (response.ok) {
                toast.success("Login successful!", {
                    onClose: () => {
                        const socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET);
                        socket.onopen = () => {
                            console.log("WebSocket connection established");
                            navigate("/chat");
                        };
                        socket.onerror = (error) => {
                            console.error("WebSocket error:", error);
                        };
                    }
                });
                localStorage.setItem("token", data.token);
            } else {
                toast.error(data.message || "Login failed!");
            }
        } catch (error) {
            console.error("Error logging in:", error);
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