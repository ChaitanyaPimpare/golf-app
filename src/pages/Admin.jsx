import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"
import "./admin.css"

function Admin() {
  const [drawNumbers, setDrawNumbers] = useState([])
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ================= CHECK ADMIN =================
  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
      navigate("/login")
      return
    }

    // 🔒 SIMPLE ADMIN CHECK
    if (data.user.email !== "admin@gmail.com") {
      alert("Access denied 🚫")
      navigate("/dashboard")
    }
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
    if (drawNumbers.length !== 5) {
      return alert("Generate draw first")
    }

    setLoading(true)

    const { error } = await supabase.from("draws").insert({
      numbers: drawNumbers
    })

    setLoading(false)

    if (error) return alert("Error saving draw")

    alert("Draw saved 🎉")
  }

  // ================= MATCH LOGIC =================
  const checkMatch = (userScores, drawNumbers) => {
    return userScores.filter((num) => drawNumbers.includes(num)).length
  }

  // ================= RUN DRAW =================
  const runDraw = async () => {
    if (drawNumbers.length !== 5) {
      return alert("Generate draw first")
    }

    setLoading(true)

    const { data: scores, error } = await supabase
      .from("scores")
      .select("*")

    if (error) {
      setLoading(false)
      return alert("Error fetching scores")
    }

    const userScoresMap = {}

    scores.forEach((s) => {
      if (!userScoresMap[s.user_id]) {
        userScoresMap[s.user_id] = []
      }
      userScoresMap[s.user_id].push(s.score)
    })

    let winnersList = []

    for (let userId in userScoresMap) {
      const userScores = userScoresMap[userId]
      const matchCount = checkMatch(userScores, drawNumbers)

      if (matchCount >= 3) {
        winnersList.push({
          user_id: userId,
          match: matchCount
        })
      }
    }

    // SAVE WINNERS
    for (let w of winnersList) {
      await supabase.from("winnings").insert({
        user_id: w.user_id,
        match: w.match,
        amount: w.match === 5 ? 1000 : w.match === 4 ? 500 : 100
      })
    }

    setWinners(winnersList)
    setLoading(false)

    alert("Draw executed + Winners saved ✅")
  }

  return (
    <div className="admin">
      
      {/* HEADER */}
      <div className="admin-header">
        <h2>Admin Panel ⚡</h2>
        <p>Manage draw system</p>
      </div>

      {/* ACTIONS */}
      <div className="card">
        <h3>Draw Controls</h3>

        <div className="btn-group">
          <button onClick={generateDraw}>🎯 Generate</button>
          <button onClick={saveDraw}>💾 Save</button>
          <button onClick={runDraw}>🚀 Run</button>
        </div>

        <div className="numbers">
          {drawNumbers.length > 0
            ? drawNumbers.join(" , ")
            : "No draw generated"}
        </div>
      </div>

      {/* LOADING */}
      {loading && <p>Processing...</p>}

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
                <b>Match: {w.match}</b>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Admin