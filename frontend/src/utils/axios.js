// frontend/src/utils/axios.js
import axios from "axios";

// Create an axios instance with base config
const api = axios.create({
    baseURL: "http://localhost:5000/api", // backend base URL
    withCredentials: true, // important for sending cookies/session
});

export default api;
