import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate, Link } from "react-router-dom"
import "./auth.css"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (error) return alert(error.message)

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
      })
    }

    alert("Signup successful 🎉")
    navigate("/login")
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Signup</h2>
        <p>Create your account</p>

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

        <button onClick={handleSignup}>Signup</button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup