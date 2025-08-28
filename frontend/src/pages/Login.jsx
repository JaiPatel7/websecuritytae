import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            }, { withCredentials: true });

            if (res.data.message === "Login successful") {
                sessionStorage.setItem("expiresAt", res.data.session.expiresAt);
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
                <h2 className="text-3xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
                    Welcome Back 👋
                </h2>

                {error && (
                    <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-md"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-gray-200 text-center mt-6">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-black hover:underline  hover:text-white">
                        Sign up
                        </a>
                 
                </p>
            </div>
        </div>
    );
};

export default Login;
