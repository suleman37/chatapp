import { toast } from "react-toastify";

const SignUp = ({ formData, onChange }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Signup successful!");
            } else {
                if (data.message === "User Already Exists") {
                    toast.error("This email is already registered.");
                } else if (data.message) {
                    toast.success(data.message);
                } else {
                    toast.error("Signup failed!");
                }
            }
        } catch (error) {
            console.error("Error signing up:", error);
            toast.error("Error signing up!");
        }
    };


    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
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
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
            </button>
        </form>
    );
};

export default SignUp;