// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Log = require("../models/Log")

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    console.log("Request Body:", req.body); 
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error("Registration error:", err)
        res.status(500).json({
            error: "User registration failed",
            details: err.message,
        });
    }
});



// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const userAgent = req.get("User-Agent") || "unknown";

    try {
        const user = await User.findOne({ email });
        if (!user) {
            await Log.create({ userId: null, email, success: false, ip, userAgent });
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await Log.create({ userId: user._id, email, success: false, ip, userAgent });
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Regenerate session
        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ error: "Session reset failed" });

            req.session.userId = user._id;

            // Set cookie maxAge (15 mins)
            req.session.cookie.maxAge = 15 * 60 * 1000;

           
            Log.create({ userId: user._id, email, success: true, ip, userAgent });

            // Send exact expiresAt to frontend
            res.json({
                message: "Login successful",
                session: {
                    id: req.sessionID,
                    expiresAt: new Date(Date.now() + req.session.cookie.maxAge)
                }
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});



// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
});

router.get("/test", (req, res) => {
    res.json({ message: "Auth routes working!" });
});




router.get("/logs", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });

    try {
        const logs = await Log.find({ userId: req.session.userId }).sort({ createdAt: -1 }).limit(10);
        res.json({ logs });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});
// Clear all login logs for current user
router.delete("/logs", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });

    try {
        await Log.deleteMany({ userId: req.session.userId });
        res.json({ message: "Logs cleared successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to clear logs" });
    }
});


//current logged-in user + session info
router.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = await User.findById(req.session.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            user,
            session: {
                id: req.sessionID,
                createdAt: req.session.cookie._expires
                    ? new Date(Date.now() - (req.session.cookie.originalMaxAge - (req.session.cookie.expires - Date.now())))
                    : null,
                expiresAt: req.session.cookie.expires,
                maxAge: req.session.cookie.maxAge,
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});




module.exports = router;
