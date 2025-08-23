// frontend/src/pages/Login.jsx
import { useState } from "react";
import api from "../utils/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            setMessage("✅ Login successful!");
            console.log("User:", res.data);
        } catch (err) {
            setMessage("❌ " + (err.response?.data?.error || "Login failed"));
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>

                {message && <p className="mt-3 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default Login;
