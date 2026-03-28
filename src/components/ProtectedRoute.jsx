import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../supabase"

function ProtectedRoute({ children, roleRequired }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        setLoading(false)
        return
      }

      setUser(data.user)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()

      if (profileError || !profile) {
        setLoading(false)
        return
      }

      setRole(profile.role)
    } catch (err) {
      console.error("Auth Error:", err)
    } finally {
      setLoading(false)
    }
  }

  // 🔄 Loading UI
  if (loading) {
    return <div className="loading">Checking access...</div>
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />
  }

  // ❌ Role mismatch
  if (roleRequired && role !== roleRequired) {
    // Smart redirect
    if (role === "super_admin") {
      return <Navigate to="/admin" />
    } else {
      return <Navigate to="/dashboard" />
    }
  }

  // ✅ Authorized
  return children
}

export default ProtectedRoute