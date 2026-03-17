// src/pages/Login.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../api"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogin() {
        // 1. Check if fields are empty
        if(!email || !password) {
            setError("please fill all fields")
            return
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError("please enter a valid email address")
            return
        }

        setLoading(true)
        setError("")

        const data = await loginUser(email, password)

        if(data.success) {
            navigate("/dashboard")
        } else {
            setError(data.error || "login failed")
        }

        setLoading(false)
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "logging in..." : "Login"}
                </button>

                <p>
                    No account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    )
}

export default Login