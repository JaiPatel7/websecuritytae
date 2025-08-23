// backend/server.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const csurf = require("csurf");
const connectDB = require("./config/db");
const cors = require("cors")

const authRoutes = require("./routes/authRoutes");

const app = express();
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173", // your frontend URL
        credentials: true, // allow cookies (important for sessions)
    })
);


// Session Setup
app.use(
    session({
        secret: process.env.SESSION_SECRET, // must be long, random string
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 60 * 15, // 15 minutes (same as cookie maxAge)
        }),
        cookie: {
            httpOnly: true, // prevent JS access to cookie
            secure: process.env.NODE_ENV === "production", // only true in HTTPS
            sameSite: "strict", // block CSRF from other sites
            maxAge: 1000 * 60 * 15, // 15 minutes
        },
    })
);

// CSRF Protection (will configure properly later)
//  app.use(csurf());

// Routes
app.use("/api/auth", authRoutes);

// Global error handler for safety
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
