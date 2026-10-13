require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 5000

/* ─── Global Safety Nets ───────────────────────────────────────────── */

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason)
    // In production you might want to exit; in dev keep running
})

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err)
    process.exit(1) // must exit — process state is unreliable
})

/* ─── Startup ──────────────────────────────────────────────────────── */

;(async () => {
    try {
        await connectToDB()

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Startup failed:", err)
        process.exit(1)
    }
})()