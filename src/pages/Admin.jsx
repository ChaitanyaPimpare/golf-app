import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"
import Sidebar from "../layout/Sidebar"
import Header from "../layout/Header"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import "../styles/admin.css"

function Admin() {
  const [drawNumbers, setDrawNumbers] = useState([])
  const [winners, setWinners] = useState([])
  const [stats, setStats] = useState({
    users: 0,
    totalRevenue: 0,
    totalWinnings: 0,
  })
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    checkAdmin()
    fetchAnalytics()
  }, [])

  // ================= AUTH CHECK =================
  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
      navigate("/login")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle()

    if (!profile || profile.role !== "super_admin") {
      navigate("/dashboard")
      return
    }

    setProfile(profile)
  }

  // ================= ANALYTICS =================
  const fetchAnalytics = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*")
    const { data: winnings } = await supabase.from("winnings").select("*")

    setStats({
      users: profiles?.length || 0,
      totalRevenue: (profiles?.length || 0) * 100,
      totalWinnings:
        winnings?.reduce((sum, w) => sum + w.amount, 0) || 0,
    })
  }

  // ================= GENERATE DRAW =================
  const generateDraw = () => {
    let numbers = []

    while (numbers.length < 5) {
      let num = Math.floor(Math.random() * 45) + 1
      if (!numbers.includes(num)) numbers.push(num)
    }

    setDrawNumbers(numbers)
  }

  // ================= SAVE DRAW =================
  const saveDraw = async () => {
    if (drawNumbers.length !== 5) return alert("Generate draw first")

    await supabase.from("draws").insert({
      numbers: drawNumbers,
    })

    alert("Draw saved 🎉")
  }

  // ================= MATCH LOGIC =================
  const checkMatch = (userScores, drawNumbers) => {
    return userScores.filter((num) =>
      drawNumbers.includes(num)
    ).length
  }

  // ================= RUN DRAW =================
  const runDraw = async () => {
    if (drawNumbers.length !== 5) return alert("Generate draw first")

    setLoading(true)

    const { data: scores } = await supabase.from("scores").select("*")

    const userScoresMap = {}

    scores.forEach((s) => {
      if (!userScoresMap[s.user_id]) {
        userScoresMap[s.user_id] = []
      }
      userScoresMap[s.user_id].push(s.score)
    })

    let winnersList = []

    for (let userId in userScoresMap) {
      const match = checkMatch(userScoresMap[userId], drawNumbers)

      if (match >= 3) {
        winnersList.push({ user_id: userId, match })
      }
    }

    // ===== PRIZE POOL =====
    const totalUsers = Object.keys(userScoresMap).length
    const totalPool = totalUsers * 100

    const pool = {
      5: totalPool * 0.4,
      4: totalPool * 0.35,
      3: totalPool * 0.25,
    }

    const winnersByMatch = { 3: [], 4: [], 5: [] }

    winnersList.forEach((w) => {
      winnersByMatch[w.match].push(w)
    })

    // ===== BULK INSERT =====
    const inserts = []

    for (let matchType of [5, 4, 3]) {
      const tier = winnersByMatch[matchType]

      if (tier.length === 0) continue

      const prize = pool[matchType] / tier.length

      tier.forEach((w) => {
        inserts.push({
          user_id: w.user_id,
          match: w.match,
          amount: Math.round(prize),
          status: "pending",
        })
      })
    }

    if (inserts.length > 0) {
      await supabase.from("winnings").insert(inserts)
    }

    setWinners(winnersList)
    setLoading(false)

    alert(`Draw completed 🎉 Pool ₹${totalPool}`)
  }

  // ================= CHART DATA =================
  const chartData = [
    { name: "Revenue", value: stats.totalRevenue },
    { name: "Winnings", value: stats.totalWinnings },
  ]

  const COLORS = ["#22c55e", "#f59e0b"]

  if (!profile) return <div className="loading">Loading...</div>

  return (
    <div className="layout">
      <Sidebar role={profile.role} />

      <div className="main">
        <Header user={profile} />

        <div className="admin">
          {/* HEADER */}
          <div className="admin-header">
            <h2>Admin Dashboard ⚡</h2>
            <p>Manage platform & analytics</p>
          </div>

          {/* STATS */}
          <div className="stats">
            <div>
              <p>Users</p>
              <h2>{stats.users}</h2>
            </div>

            <div>
              <p>Revenue</p>
              <h2>₹{stats.totalRevenue}</h2>
            </div>

            <div>
              <p>Winnings</p>
              <h2>₹{stats.totalWinnings}</h2>
            </div>
          </div>

          {/* DRAW */}
          <div className="card">
            <h3>Draw System</h3>

            <div className="btn-group">
              <button onClick={generateDraw}>Generate</button>
              <button onClick={saveDraw}>Save</button>
              <button onClick={runDraw}>Run</button>
            </div>

            <div className="numbers">
              {drawNumbers.join(" , ") || "No draw"}
            </div>
          </div>

          {/* CHART */}
          <div className="card">
            <h3>Analytics</h3>

            <PieChart width={350} height={260}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* WINNERS */}
          <div className="card">
            <h3>Winners</h3>

            {winners.length === 0 ? (
              <p>No winners yet</p>
            ) : (
              <ul>
                {winners.map((w, i) => (
                  <li key={i}>
                    <span>{w.user_id}</span>
                    <b>Match {w.match}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {loading && <p>Processing draw...</p>}
        </div>
      </div>
    </div>
  )
}

export default Admin