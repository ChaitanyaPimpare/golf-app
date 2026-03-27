import { useState } from "react"
import { supabase } from "../supabase"

function Admin() {
  const [drawNumbers, setDrawNumbers] = useState([])
  const [winners, setWinners] = useState([])

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

    const { error } = await supabase.from("draws").insert({
      numbers: drawNumbers
    })

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

    const { data: scores, error } = await supabase
      .from("scores")
      .select("*")

    if (error) return alert("Error fetching scores")

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

    // ✅ SAVE WINNERS TO DB
    for (let w of winnersList) {
      await supabase.from("winnings").insert({
        user_id: w.user_id,
        match: w.match,
        amount: w.match === 5 ? 1000 : w.match === 4 ? 500 : 100
      })
    }

    setWinners(winnersList)
    alert("Draw executed + Winners saved ✅")
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Panel</h2>

      <button onClick={generateDraw}>Generate Draw</button>

      <h3>Numbers: {drawNumbers.join(", ")}</h3>

      <button onClick={saveDraw}>Save Draw</button>

      <br /><br />

      <button onClick={runDraw}>Run Draw</button>

      <h3>Winners</h3>

      {winners.length === 0 ? (
        <p>No winners yet</p>
      ) : (
        <ul>
          {winners.map((w, i) => (
            <li key={i}>
              User: {w.user_id} | Match: {w.match}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Admin