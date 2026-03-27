import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState([])
  const [winnings, setWinnings] = useState([])
  const [newScore, setNewScore] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

  // ================= USER =================
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
      navigate("/login")
      return
    }

    setUser(data.user)

    fetchScores(data.user.id)
    fetchWinnings(data.user.id)
  }

  // ================= FETCH SCORES =================
  const fetchScores = async (userId) => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    setScores(data || [])
  }

  // ================= FETCH WINNINGS =================
  const fetchWinnings = async (userId) => {
    const { data } = await supabase
      .from("winnings")
      .select("*")
      .eq("user_id", userId)

    setWinnings(data || [])
  }

  // ================= ADD SCORE =================
  const addScore = async () => {
    if (!newScore) return alert("Enter score")

    const scoreValue = parseInt(newScore)

    if (scoreValue < 1 || scoreValue > 45) {
      return alert("Score must be between 1–45")
    }

    const { data: existing } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (existing.length >= 5) {
      const oldest = existing[existing.length - 1]
      await supabase.from("scores").delete().eq("id", oldest.id)
    }

    await supabase.from("scores").insert({
      user_id: user.id,
      score: scoreValue,
      date: new Date()
    })

    setNewScore("")
    fetchScores(user.id)
  }

  if (!user) return <h2 style={{ padding: "30px" }}>Loading...</h2>

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard</h2>

      <p>User: {user.email}</p>

      {/* ================= ADD SCORE ================= */}
      <h3>Add Score</h3>
      <input
        type="number"
        value={newScore}
        onChange={(e) => setNewScore(e.target.value)}
        placeholder="1-45"
      />
      <button onClick={addScore}>Add</button>

      {/* ================= SCORES ================= */}
      <h3>Your Scores</h3>
      {scores.length === 0 ? (
        <p>No scores yet</p>
      ) : (
        <ul>
          {scores.map((s) => (
            <li key={s.id}>
              {s.score} ({new Date(s.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}

      {/* ================= WINNINGS ================= */}
      <h3>Your Winnings</h3>
      {winnings.length === 0 ? (
        <p>No winnings yet</p>
      ) : (
        <ul>
          {winnings.map((w) => (
            <li key={w.id}>
              Match: {w.match} | ₹{w.amount} | {w.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard