import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import Sidebar from "../layout/Sidebar"
import Header from "../layout/Header"
import "../styles/layout.css"

function Subscription() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [charities, setCharities] = useState([])

  const [selected, setSelected] = useState("")
  const [plan, setPlan] = useState("monthly")
  const [percentage, setPercentage] = useState(10)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) return

    setUser(data.user)

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    const { data: charities } = await supabase
      .from("charities")
      .select("*")

    setProfile(profile)
    setCharities(charities || [])
    setLoading(false)
  }

  const activate = async () => {
    if (!selected) return alert("Select charity")

    if (percentage < 10) {
      return alert("Minimum contribution is 10%")
    }

    const renewal =
      plan === "monthly"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

    await supabase
      .from("profiles")
      .update({
        subscription_status: "active",
        plan,
        charity_id: selected,
        contribution_percentage: percentage,
        renewal_date: renewal
      })
      .eq("id", user.id)

    alert("Subscription Activated 🎉")
    load()
  }

  if (loading) return <div className="loading">Loading...</div>

return (
  <div className="layout">
    <Sidebar />

    <div className="main">
      <Header user={user} />

      {/* CURRENT STATUS */}
      <div className="card subscription-status">
        <h3>Current Subscription</h3>

        <p>Status: <strong>{profile?.subscription_status || "inactive"}</strong></p>
        <p>Plan: <strong>{profile?.plan || "-"}</strong></p>
        <p>
          Renewal:{" "}
          <strong>
            {profile?.renewal_date
              ? new Date(profile.renewal_date).toLocaleDateString()
              : "-"}
          </strong>
        </p>
      </div>

      {/* ACTIVATE */}
      <div className="card">
        <h3>Activate Subscription</h3>

        {/* PLAN (Better UI) */}
        <div className="plan-toggle">
          <button
            className={`plan-btn ${plan === "monthly" ? "active" : ""}`}
            onClick={() => setPlan("monthly")}
          >
            Monthly
          </button>

          <button
            className={`plan-btn ${plan === "yearly" ? "active" : ""}`}
            onClick={() => setPlan("yearly")}
          >
            Yearly (Save more)
          </button>
        </div>

        {/* CHARITY */}
        <div className="form-group">
          <label>Select Charity</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Choose Charity</option>
            {charities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONTRIBUTION */}
        <div className="form-group">
          <label>Charity Contribution (%)</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            min={10}
          />
        </div>

        {/* BUTTON */}
        <button className="primary-btn" onClick={activate}>
          Activate Subscription
        </button>
      </div>
    </div>
  </div>
)
}

export default Subscription