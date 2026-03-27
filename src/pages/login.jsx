import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Login successful 🚀")
      navigate("/dashboard")
    }
  }

 const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  })

  if (error) {
    alert(error.message)
    return
  }

  // 👉 MANUALLY INSERT PROFILE (IMPORTANT)
  const user = data.user

  if (user) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
    })
  }

  alert("Signup successful 🎉")
}

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login / Signup</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
      <br /><br />
      <button onClick={handleSignup}>Signup</button>
    </div>
  )
}

export default Login