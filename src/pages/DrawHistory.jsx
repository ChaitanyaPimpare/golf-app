import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import Sidebar from "../layout/Sidebar"
import Header from "../layout/Header"
import "../styles/layout.css"

function DrawHistory() {
  const [draws, setDraws] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    fetchDraws()
  }

  const fetchDraws = async () => {
    const { data } = await supabase
      .from("draw_history")
      .select("*")
      .order("created_at", { ascending: false })

    setDraws(data || [])
  }

  return (
    <div className="layout">
      {/* ✅ SIDEBAR FIX */}
      <Sidebar />

      <div className="main">
        {/* ✅ HEADER */}
        <Header user={user} />

        {/* CONTENT */}
        <div className="card">
          <h2>Draw History</h2>

          {draws.length === 0 ? (
            <p>No draws yet</p>
          ) : (
            draws.map((d) => (
              <div key={d.id} className="list">
                🎯 {Array.isArray(d.numbers) ? d.numbers.join(", ") : d.numbers}
                <span>₹{d.total_pool}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DrawHistory