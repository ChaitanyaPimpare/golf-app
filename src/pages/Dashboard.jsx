import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import Sidebar from "../layout/Sidebar"
import Header from "../layout/Header"
import "../styles/dashboard.css"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null) // ✅ ADD THIS
  const [scores, setScores] = useState([])
  const [winnings, setWinnings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) return

    setUser(data.user)

    // ✅ FETCH PROFILE (IMPORTANT)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle()

    console.log("PROFILE:", profile)

    setProfile(profile)

    const { data: scores } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", data.user.id)
      .order("date", { ascending: false })

    const { data: winnings } = await supabase
      .from("winnings")
      .select("*")
      .eq("user_id", data.user.id)

    setScores(scores || [])
    setWinnings(winnings || [])

    setLoading(false)
  }

  // ✅ WAIT FOR PROFILE ALSO
  if (loading || !profile) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="layout">
      {/* ✅ PASS ROLE */}
      <Sidebar role={profile.role} />

      <div className="main">
        <Header user={user} />

        {/* GREETING */}
        <div className="card">
          <h2>Welcome back 👋</h2>
          <p>Track your performance and winnings</p>
        </div>

        {/* STATS */}
       <div className="stats">

  <div className="card">
    <p>Total Scores</p>
    <h2>{scores.length}</h2>
  </div>

  <div className="card">
    <p>Total Winnings</p>
    <h2>₹{winnings.reduce((s, w) => s + w.amount, 0)}</h2>
  </div>

  <div className="card">
    <p>Last Score</p>
    <h2>{scores[0]?.score || "-"}</h2>
  </div>

</div>

        {/* RECENT ACTIVITY */}
        <div className="card">
          <h3>Recent Scores</h3>

          {scores.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            scores.slice(0, 5).map((s) => (
              <div key={s.id} className="list">
                {s.score}
                <span>{new Date(s.date).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard