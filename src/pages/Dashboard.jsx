import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"
import {
  FaChartBar,
  FaMoneyBill,
  FaTrophy,
  FaSignOutAlt
} from "react-icons/fa"
import "./dashboard.css"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState([])
  const [winnings, setWinnings] = useState([])
  const [newScore, setNewScore] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

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

  const fetchScores = async (userId) => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    setScores(data || [])
  }

  const fetchWinnings = async (userId) => {
    const { data } = await supabase
      .from("winnings")
      .select("*")
      .eq("user_id", userId)

    setWinnings(data || [])
  }

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  if (!user) return <h2 className="loading">Loading...</h2>

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">⛳ Golf</h2>

        <ul>
          <li className="active"><FaChartBar /> Dashboard</li>
          <li><FaTrophy /> Scores</li>
          <li><FaMoneyBill /> Winnings</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* NAVBAR */}
        <div className="navbar">
          <input className="search" placeholder="Search..." />

          <div className="nav-right">
            <span>{user.email}</span>
            <button onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">

          {/* STATS */}
          <div className="stats">
            <div className="card">
              <h4>Total Scores</h4>
              <p>{scores.length}</p>
            </div>

            <div className="card">
              <h4>Total Winnings</h4>
              <p>₹{winnings.reduce((s, w) => s + w.amount, 0)}</p>
            </div>

            <div className="card">
              <h4>Last Score</h4>
              <p>{scores[0]?.score || "-"}</p>
            </div>
          </div>

          {/* ADD SCORE */}
          <div className="card">
            <h3>Add Score</h3>
            <div className="input-group">
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                placeholder="1-45"
              />
              <button onClick={addScore}>Add</button>
            </div>
          </div>

          {/* SCORES */}
          <div className="card">
            <h3>Recent Scores</h3>
            {scores.length === 0 ? (
              <p>No scores</p>
            ) : (
              <ul>
                {scores.map((s) => (
                  <li key={s.id}>
                    {s.score}
                    <span>{new Date(s.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* WINNINGS */}
          <div className="card">
            <h3>Winnings</h3>
            {winnings.length === 0 ? (
              <p>No winnings</p>
            ) : (
              <ul>
                {winnings.map((w) => (
                  <li key={w.id}>
                    Match {w.match}
                    <span>₹{w.amount}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard