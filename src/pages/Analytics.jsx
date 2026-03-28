import { useEffect, useState } from "react"
import { supabase } from "../supabase"
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

function Analytics() {
  const [stats, setStats] = useState({
    users: 0,
    totalRevenue: 0,
    totalWinnings: 0,
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

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

  const chartData = [
    { name: "Revenue", value: stats.totalRevenue },
    { name: "Winnings", value: stats.totalWinnings },
  ]

  const COLORS = ["#22c55e", "#f59e0b"]

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="admin">
          <div className="admin-header">
            <h2>Analytics 📊</h2>
            <p>Platform insights</p>
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

          {/* CHART */}
          <div className="card">
            <h3>Revenue vs Winnings</h3>

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

        </div>
      </div>
    </div>
  )
}

export default Analytics