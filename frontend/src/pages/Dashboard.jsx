// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeRemaining, setTimeRemaining] = useState(""); // live countdown
    const [logs, setLogs] = useState([]); // recent login attempts

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get("/auth/me", { withCredentials: true });
                setUserData(res.data);
                setLoading(false);

                // Initialize countdown
                const updateCountdown = () => {
                    const now = new Date();
                    const expiresAt = new Date(res.data.session.expiresAt);
                    const diff = expiresAt - now; // difference in milliseconds

                    if (diff <= 0) {
                        setTimeRemaining("Session expired");
                        clearInterval(interval);
                        navigate("/login");
                    } else {
                        const minutes = Math.floor(diff / 1000 / 60);
                        const seconds = Math.floor((diff / 1000) % 60);
                        setTimeRemaining(`${minutes}m ${seconds}s`);
                    }
                };

                updateCountdown(); // initial call
                const interval = setInterval(updateCountdown, 1000);
                return () => clearInterval(interval); // cleanup
            } catch (err) {
                setError("Failed to fetch user data. Please login again.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Fetch recent login attempts
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get("/auth/logs", { withCredentials: true });
                setLogs(res.data.logs);
            } catch (err) {
                console.error("Failed to fetch logs:", err);
            }
        };

        if (userData) fetchLogs();
    }, [userData]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
                <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Welcome, {userData.user.username}!
            </h1>

            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Your Info</h2>
                <p><span className="font-medium">Username:</span> {userData.user.username}</p>
                <p><span className="font-medium">Email:</span> {userData.user.email}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Session Info</h2>
                <p><span className="font-medium">Session ID:</span> {userData.session.id}</p>
                <p><span className="font-medium">Created At:</span> {new Date(userData.session.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Expires At:</span> {new Date(userData.session.expiresAt).toLocaleString()}</p>
                <p><span className="font-medium">Max Age:</span> {Math.floor(userData.session.maxAge / 1000 / 60)} minutes</p>
                <p><span className="font-medium">Time Remaining:</span> {timeRemaining}</p>
            </div>

            {/* Recent login attempts */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Recent Login Attempts</h2>
                {logs.length === 0 && <p>No login attempts found.</p>}
                <ul className="space-y-2">
                    {logs.map((log) => (
                        <li key={log._id} className="border p-2 rounded">
                            <p><span className="font-medium">Status:</span> {log.success ? "✅ Success" : "❌ Failed"}</p>
                            <p><span className="font-medium">IP:</span> {log.ip}</p>
                            <p><span className="font-medium">User Agent:</span> {log.userAgent}</p>
                            <p><span className="font-medium">Time:</span> {new Date(log.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={async () => {
                        try {
                            await api.delete("/auth/logs", { withCredentials: true });
                            setLogs([]); // Clear locally as well
                        } catch (err) {
                            console.error("Failed to clear logs:", err);
                        }
                    }}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Clear Logs
                </button>

            </div>

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
