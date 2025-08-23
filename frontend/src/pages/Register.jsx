import { useState } from "react";
import api from "../utils/axios";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", {
                username,
                email,
                password,
            });
            setMessage("✅ Registration successful!");
            console.log("Registered:", res.data);
        } catch (err) {
            setMessage("❌ " + (err.response?.data?.message || "Registration failed"));
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form
                onSubmit={handleRegister}
                className="bg-white p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-4">Register</h2>

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border p-2 mb-3 rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

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
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Register
                </button>

                {message && <p className="mt-3 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default Register;
