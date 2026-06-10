import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './auth.form.css'

const Login = () => {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Please fill in all fields.")
            return
        }
        setSubmitting(true)
        setError(null)
        const result = await handleLogin({ email, password })
        setSubmitting(false)
        if (result.success) {
            navigate('/')
        } else {
            setError(result.message)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Sign In</h1>
                    <p>Welcome back. Enter your credentials to continue.</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name="email"
                            placeholder="you@example.com"
                            value={email}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" name="password"
                            placeholder="Enter your password"
                            value={password}
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={submitting}>
                        {submitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login
