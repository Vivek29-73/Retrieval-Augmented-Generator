// src/pages/Register.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../api"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleRegister() {
        if(!name || !email || !password) {
            setError("please fill all fields")
            return
        }

        setLoading(true)
        setError("")

        const data = await registerUser(name, email, password)

        if(data.success) {
            setSuccess("registered successfully! redirecting to login...")
            setTimeout(() => navigate("/"), 2000)
            // wait 2 seconds then redirect to login
        } else {
            setError(data.error || "registration failed")
        }

        setLoading(false)
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Register</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

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

                <button onClick={handleRegister} disabled={loading}>
                    {loading ? "registering..." : "Register"}
                </button>

                <p>
                    Have account? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    )
}

export default Register