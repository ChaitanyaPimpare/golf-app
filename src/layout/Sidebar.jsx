import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../supabase"
import { getUserProfile } from "../utils/getUserRole"

import {
  FiHome,
  FiBarChart2,
  FiCreditCard,
  FiAward,
  FiSettings,
  FiTrendingUp,
  FiClock,
  FiLogOut,
  FiMenu
} from "react-icons/fi"

import "../styles/sidebar.css"

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [role, setRole] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchRole()
  }, [])

  const fetchRole = async () => {
    const profile = await getUserProfile()
    setRole(profile?.role)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  const menuItem = (path, icon, label) => (
    <div
      className={`menu-item ${isActive(path) ? "active" : ""}`}
      onClick={() => navigate(path)}
    >
      <span className="icon">{icon}</span>
      {!collapsed && <span className="label">{label}</span>}
    </div>
  )

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* HEADER */}
    <div className="sidebar-header">
  {!collapsed && <h2>Golf SaaS</h2>}

  <button className="toggle" onClick={() => setCollapsed(!collapsed)}>
    <FiMenu />
  </button>
</div>

      {/* MENU */}
      <div className="menu">

        {role === "user" && (
          <>
            {menuItem("/dashboard", <FiHome />, "Dashboard")}
            {menuItem("/scores", <FiBarChart2 />, "Scores")}
            {menuItem("/subscription", <FiCreditCard />, "Subscription")}
            {menuItem("/leaderboard", <FiAward />, "Leaderboard")}
          </>
        )}

        {role === "super_admin" && (
          <>
            {menuItem("/admin", <FiSettings />, "Admin Panel")}
            {menuItem("/analytics", <FiTrendingUp />, "Analytics")}
            {menuItem("/history", <FiClock />, "Draw History")}
            {menuItem("/leaderboard", <FiAward />, "Leaderboard")}
          </>
        )}

      </div>

      {/* LOGOUT */}
      <div className="logout-section" onClick={logout}>
        <FiLogOut className="icon" />
        {!collapsed && <span>Logout</span>}
      </div>
    </div>
  )
}

export default Sidebar