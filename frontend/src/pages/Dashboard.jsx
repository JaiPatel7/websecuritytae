// frontend/src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout"); // ✅ cookies are auto sent
            navigate("/login");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>

            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
