const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email and password" })
        }

        const exists = await userModel.findOne({ $or: [{ username }, { email }] })
        if (exists) {
            return res.status(400).json({ message: "Account already exists with this email or username" })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username, email, password: hash })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("registerUserController error:", err)
        res.status(500).json({ message: "Registration failed.", error: err.message })
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
        res.status(200).json({
            message: "User logged in successfully.",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("loginUserController error:", err)
        res.status(500).json({ message: "Login failed.", error: err.message })
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            await tokenBlacklistModel.create({ token })
        }
        res.clearCookie("token")
        res.status(200).json({ message: "User logged out successfully" })
    } catch (err) {
        console.error("logoutUserController error:", err)
        res.status(500).json({ message: "Logout failed.", error: err.message })
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        res.status(200).json({
            message: "User details fetched successfully",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("getMeController error:", err)
        res.status(500).json({ message: "Failed to fetch user.", error: err.message })
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }
