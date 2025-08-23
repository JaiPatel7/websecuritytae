// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/me");
                setUser(res.data.user);
                setSession(res.data.session);
            } catch (err) {
                console.error("Not authenticated:", err);
                navigate("/login"); // redirect if not logged in
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            navigate("/login");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {user && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow-md w-96">
                    <h2 className="text-xl font-semibold mb-2">👤 User Info</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}

            {session && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow-md w-96">
                    <h2 className="text-xl font-semibold mb-2">🔐 Session Info</h2>
                    <p><strong>Session ID:</strong> {session.id}</p>
                    <p><strong>Expires At:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
                    <p><strong>Max Age:</strong> {session.maxAge / 1000 / 60} minutes</p>
                </div>
            )}

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
