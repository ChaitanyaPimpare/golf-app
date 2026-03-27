import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Admin from "./pages/Admin"
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
         <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App