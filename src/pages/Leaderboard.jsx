import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import Sidebar from "../layout/Sidebar"
import Header from "../layout/Header"
import "../styles/leaderboard.css"

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("winnings")
      .select("user_id, amount")

    if (error) {
      console.error(error)
      return
    }

    if (!data || data.length === 0) {
      setLeaders([])
      setLoading(false)
      return
    }

    // 🔥 Aggregate winnings
    const map = {}

    data.forEach((w) => {
      if (!map[w.user_id]) map[w.user_id] = 0
      map[w.user_id] += w.amount
    })

    let sorted = Object.entries(map)
      .map(([user_id, total]) => ({ user_id, total }))
      .sort((a, b) => b.total - a.total)

    // 🔥 Fetch user emails
    const userIds = sorted.map((l) => l.user_id)

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds)

    const emailMap = {}
    profiles?.forEach((p) => {
      emailMap[p.id] = p.email
    })

    sorted = sorted.map((l) => ({
      ...l,
      email: emailMap[l.user_id] || "Unknown"
    }))

    setLeaders(sorted)
    setLoading(false)
  }

  if (loading) return <div className="loading">Loading leaderboard...</div>

  const top3 = leaders.slice(0, 3)
  const rest = leaders.slice(3)

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="card">
          <h2>Leaderboard 🏆</h2>

          {/* 🥇 TOP 3 */}
          <div className="top3">
            {top3.map((l, i) => (
              <div key={i} className={`top-card rank-${i}`}>
                <div className="rank">#{i + 1}</div>
                <div className="avatar">
                  {l.email.charAt(0).toUpperCase()}
                </div>
                <p className="email">{l.email}</p>
                <h3>₹{l.total}</h3>
              </div>
            ))}
          </div>

          {/* 📋 REST LIST */}
          <div className="list-container">
            {rest.length === 0 ? (
              <p>No more users</p>
            ) : (
              rest.map((l, i) => (
                <div key={i} className="list">
                  <span>#{i + 4}</span>
                  <span>{l.email}</span>
                  <strong>₹{l.total}</strong>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Leaderboard