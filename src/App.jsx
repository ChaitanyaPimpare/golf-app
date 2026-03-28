import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Admin from "./pages/Admin"
import DrawHistory from "./pages/DrawHistory"
import Leaderboard from "./pages/Leaderboard"
import Scores from "./pages/Scores"
import Subscription from "./pages/Subscription"
import ProtectedRoute from "./components/ProtectedRoute"
import Analytics from "./pages/Analytics"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roleRequired="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scores"
          element={
            <ProtectedRoute roleRequired="user">
              <Scores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscription"
          element={
            <ProtectedRoute roleRequired="user">
              <Subscription />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="super_admin">
              <Admin />
            </ProtectedRoute>
          }
        />

   <Route
  path="/analytics"
  element={
    <ProtectedRoute roleRequired="super_admin">
      <Analytics />
    </ProtectedRoute>
  }
/>

        <Route
          path="/history"
          element={
            <ProtectedRoute roleRequired="super_admin">
              <DrawHistory />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App