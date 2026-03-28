import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import Sidebar from "../layout/Sidebar"
import Header from "../layout/Header"
import "../styles/layout.css"

function Scores() {
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState([])
  const [newScore, setNewScore] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) return

    setUser(data.user)
    await fetchScores(data.user.id)
    setLoading(false)
  }

  const fetchScores = async (userId) => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    setScores(data || [])
  }

  const addScore = async () => {
    if (!newScore) return alert("Enter score")

    const value = parseInt(newScore)

    if (value < 1 || value > 45) {
      return alert("Score must be between 1–45")
    }

    // 🔥 Get existing scores
    const { data: existing } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    // 🔥 Keep only latest 5
    if (existing.length >= 5) {
      const oldest = existing[existing.length - 1]
      await supabase.from("scores").delete().eq("id", oldest.id)
    }

    // 🔥 Insert new score
    await supabase.from("scores").insert({
      user_id: user.id,
      score: value,
      date: new Date()
    })

    setNewScore("")
    fetchScores(user.id)
  }

  if (loading) return <div className="loading">Loading scores...</div>

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Header user={user} />

        {/* ADD SCORE */}
       <div className="card">
  <h3>Add Score</h3>

  <div className="row">
    <input
      type="number"
      placeholder="Enter score (1–45)"
      value={newScore}
      onChange={(e) => setNewScore(e.target.value)}
      min="1"
      max="45"
    />

    <button onClick={addScore}>Add</button>
  </div>
</div>
        {/* SCORE LIST */}
        <div className="card">
          <h3>Your Last 5 Scores</h3>

          {scores.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            scores.map((s) => (
              <div key={s.id} className="list">
                <strong>{s.score}</strong>
                <span>{new Date(s.date).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default Scores