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
        // basic validation
        if(!email || !password) {
            setError("please fill all fields")
            return
        }

        setLoading(true)
        setError("")

        const data = await loginUser(email, password)

        if(data.success) {
            navigate("/dashboard")
            // redirect to dashboard after login
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