const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const isProduction = process.env.NODE_ENV === "production"

/** Signs a JWT with locked HS256 algorithm */
function signToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.")
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
    })
}

/** Returns secure cookie options */
function getCookieOptions() {
    return {
        httpOnly: true,
        secure: isProduction,          // HTTPS only in production
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,  // 1 day in ms — matches JWT expiry
    }
}

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email and password." })
        }

        const exists = await userModel.findOne({ $or: [{ username }, { email }] })
        if (exists) {
            return res.status(409).json({ message: "Account already exists with this email or username." })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username, email, password: hash })

        const token = signToken({ id: user._id, username: user.username })

        res.cookie("token", token, getCookieOptions())
        res.status(201).json({
            message: "User registered successfully.",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("registerUserController error:", err)
        res.status(500).json({ message: "Registration failed." })
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        const token = signToken({ id: user._id, username: user.username })

        res.cookie("token", token, getCookieOptions())
        res.status(200).json({
            message: "User logged in successfully.",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("loginUserController error:", err)
        res.status(500).json({ message: "Login failed." })
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            await tokenBlacklistModel.create({ token })
        }
        res.clearCookie("token", getCookieOptions())
        res.status(200).json({ message: "User logged out successfully." })
    } catch (err) {
        console.error("logoutUserController error:", err)
        res.status(500).json({ message: "Logout failed." })
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password -__v")
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        res.status(200).json({
            message: "User details fetched successfully.",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("getMeController error:", err)
        res.status(500).json({ message: "Failed to fetch user." })
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }
