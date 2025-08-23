import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeRemaining, setTimeRemaining] = useState(""); 
    const [logs, setLogs] = useState([]);
    const [inactivityTimeLeft, setInactivityTimeLeft] = useState(0); 

    const inactivityInterval = useRef(null);
    const activityTimeout = useRef(null);
    const globalInterval = useRef(null);

    const INACTIVITY_LIMIT = 10 * 1000; 

   
    const fetchUserData = async () => {
        try {
            const res = await api.get("/auth/me", { withCredentials: true });
            setUserData(res.data);
            setLoading(false);

            // ✅ Use backend expiresAt OR sessionStorage (after login)
            const backendExpires = new Date(res.data.session.expiresAt);
            const storedExpires = sessionStorage.getItem("expiresAt");
            const expiresAt = storedExpires ? new Date(storedExpires) : backendExpires;

            startGlobalCountdown(expiresAt);
        } catch (err) {
            setError("Failed to fetch user data. Please login again.");
            setLoading(false);
        }
    };

    const startGlobalCountdown = (expiresAt) => {
        clearInterval(globalInterval.current);

        const updateCountdown = () => {
            const now = new Date();
            const diff = expiresAt - now;

            if (diff <= 0) {
                setTimeRemaining("Session expired");
                clearInterval(globalInterval.current);
                navigate("/login");
            } else {
                const minutes = Math.floor(diff / 1000 / 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeRemaining(`${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`);
            }
        };

        updateCountdown();
        globalInterval.current = setInterval(updateCountdown, 1000);
    };




  
    const fetchLogs = async () => {
        try {
            const res = await api.get("/auth/logs", { withCredentials: true });
            setLogs(res.data.logs);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        }
    };

   
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

   
    const resetInactivityTimer = () => {
        clearTimeout(activityTimeout.current);
        clearInterval(inactivityInterval.current);
        setInactivityTimeLeft(0);

        activityTimeout.current = setTimeout(() => {
            let timeLeft = INACTIVITY_LIMIT / 1000;
            setInactivityTimeLeft(timeLeft);

            inactivityInterval.current = setInterval(() => {
                timeLeft -= 1;
                setInactivityTimeLeft(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(inactivityInterval.current);
                    navigate("/login"); // logout due to inactivity
                }
            }, 1000);
        }, INACTIVITY_LIMIT);
    };

   
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData) fetchLogs();
    }, [userData]);

    useEffect(() => {
        const events = ["mousemove", "keydown", "scroll", "touchstart"];
        events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

        resetInactivityTimer(); // initialize inactivity timer

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
            clearTimeout(activityTimeout.current);
            clearInterval(inactivityInterval.current);
            clearInterval(globalInterval.current);
        };
    }, [userData]);

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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 relative">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Welcome, {userData.user.username}!
            </h1>

            {/* User Info */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Your Info</h2>
                <p>
                    <span className="font-medium">Username:</span> {userData.user.username}
                </p>
                <p>
                    <span className="font-medium">Email:</span> {userData.user.email}
                </p>
            </div>

            {/* Session Info */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Session Info</h2>
                <p>
                    <span className="font-medium">Session ID:</span> {userData.session.id}
                </p>
                <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(userData.session.createdAt).toLocaleString()}
                </p>
                <p>
                    <span className="font-medium">Expires At:</span>{" "}
                    {new Date(userData.session.expiresAt).toLocaleString()}
                </p>
                <p>
                    <span className="font-medium">Max Age:</span>{" "}
                    {Math.floor(userData.session.maxAge / 1000 / 60)} minutes
                </p>
                <p>
                    <span className="font-medium">Time Remaining:</span> {timeRemaining}
                </p>
            </div>

            {/* Recent login attempts */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Recent Login Attempts</h2>
                {logs.length === 0 && <p>No login attempts found.</p>}
                <ul className="space-y-2">
                    {logs.map((log) => (
                        <li key={log._id} className="border p-2 rounded">
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                {log.success ? "✅ Success" : "❌ Failed"}
                            </p>
                            <p>
                                <span className="font-medium">IP:</span> {log.ip}
                            </p>
                            <p>
                                <span className="font-medium">User Agent:</span> {log.userAgent}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span>{" "}
                                {new Date(log.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={async () => {
                        try {
                            await api.delete("/auth/logs", { withCredentials: true });
                            setLogs([]);
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

           
            {inactivityTimeLeft > 0 && (
                <div className="fixed top-20 right-4 bg-red-600 text-white p-4 rounded shadow-lg w-64 z-50">
                    <p className="font-semibold">Inactivity Detected!</p>
                    <p>Session expiring in: {inactivityTimeLeft}s</p>
                    <p className="text-sm mt-1">Move mouse or press a key to reset.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
