const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

/* ─── Security & Parsing ───────────────────────────────────────────── */

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(cookieParser())

/* ─── CORS ─────────────────────────────────────────────────────────── */

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map(o => o.trim())

app.use(cors({
    origin(origin, callback) {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        callback(new Error(`CORS: origin ${origin} is not allowed`))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

/* ─── Routes ───────────────────────────────────────────────────────── */

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* ─── Health Check ─────────────────────────────────────────────────── */

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

/* ─── 404 Handler ──────────────────────────────────────────────────── */

app.use((_req, res) => {
    res.status(404).json({ message: "Route not found." })
})

/* ─── Global Error Handler ─────────────────────────────────────────── */

app.use((err, _req, res, _next) => {
    // Multer file-size / file-type errors
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large. Maximum size is 5 MB." })
    }
    if (err.message === "Only PDF files are supported.") {
        return res.status(415).json({ message: err.message })
    }

    console.error("Unhandled error:", err)
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === "production"
            ? "Internal server error."
            : err.message || "Internal server error."
    })
})

module.exports = app