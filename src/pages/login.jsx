import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate, Link } from "react-router-dom"
import { getUserProfile } from "../utils/getUserRole"
import "./auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter email and password")
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setLoading(false)
      return alert(error.message)
    }

    // 🔥 FETCH USER ROLE
    const profile = await getUserProfile()

    setLoading(false)

    if (!profile) {
      return alert("User profile not found")
    }

    // 🚀 ROLE-BASED REDIRECT
    if (profile.role === "super_admin") {
      navigate("/admin")
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Welcome Back 👋</h2>
        <p>Login to continue</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  )
}

export default Login