import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate, Link } from "react-router-dom"
import "./auth.css"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!email || !password) {
      return alert("Please fill all fields")
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters")
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (error) {
      setLoading(false)
      return alert(error.message)
    }

    // 🔐 ALWAYS CREATE USER ROLE (NO ADMIN FROM UI)
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        role: "user" // 🔥 important
      })
    }

    setLoading(false)

    alert("Signup successful 🎉 Please login")

    navigate("/login")
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create Account 🚀</h2>
        <p>Start your journey</p>

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

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup