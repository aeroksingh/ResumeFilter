const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req, res, next) {
    const authorization = req.get("authorization")
    const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
    const token = bearerToken || req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "Token not provided." })
    }

    /* ── Guard: JWT_SECRET must be configured ─── */
    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET is not set in environment variables.")
        return res.status(500).json({ message: "Server configuration error." })
    }

    try {
        /* ── Blacklist check (wrapped in try/catch so a DB hiccup
              doesn't crash the middleware) ─── */
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked." })
        }

        /* ── Verify signature + expiry ─── */
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"], // reject tokens signed with unexpected algorithms
        })

        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({ message: "Invalid token." })
        }

        req.user = decoded
        next()
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired." })
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." })
        }
        // Unexpected error (e.g. DB connection lost during blacklist check)
        console.error("authUser middleware error:", err)
        return res.status(500).json({ message: "Authentication service error." })
    }
}

module.exports = { authUser }