import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import {useGame} from '../hooks/useGame';
//pure logics and pure functions that are Independent stays out of component
function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}
//pure logics and pure functions that are Independent stays out of component
function prettyReason(result, lossReason) {
  if (result !== "lost") return "";
  if (lossReason === "timeout") return "Time ran out";
  if (lossReason === "misses") return "Too many misses";
  return "Lost";
}

export default function Leaderboard() {
  const { playersData, playersGame,clearPlayerStorage } = usePlayer();
  const { resetToStartAgain}=useGame();

  const navigate = useNavigate();
  
  const handleClear = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all saved data?"
    );

    if (!confirmed) return;
    resetToStartAgain();
    clearPlayerStorage();
    navigate("/");
  };
  //  playersData = [ { name: "Ali", id: 123, numberOfGames: 3 }, { name: "Sara", id: 456, numberOfGames: 1 } ]
  // Map: playerId -> playerName  playersGame={ 123: [ { score: 10, difficulty: "Easy", theme: "dog", date: "...", misses: 2, result: "win" ,lossReason}, {...}]
 
  const playerNameById = useMemo(() => {///faster O(1) — constant time, instant lookup table:.{123:bob , 1234:al ,...}
    const map = {};
    for (const p of playersData || []) {
      map[p.id] = p.name;
    }
    return map;
  }, [playersData]);
  // with .reduce() would be: 
  //const playerNameById = useMemo(()=>{
  //     return playersData.reduce((acc,player)=>{
  //     acc[player.name]=player.id
  //     return acc
  // },{})
  // },[playersData])


  // Flatten all games into rows for a leaderboard table
  const allGames = useMemo(() => {
    const rows = [];

    if (!playersGame) return rows;
//Object.entries(playersGame)=
// [
//   [
//     "123",
//     [
//       {
//         score: 10,
//         difficulty: "Easy",
//         theme: "dog",
//         date: "...",
//         misses: 2,
//         result: "win",
//         lossReason
//       },
//       {
//         // next game object
//       }
//     ]
//   ]
// ]  
// or: 
//[
//   ["123", [ {game1}, {game2} ]],
//   ["456", [ {gameA}, {gameB} ]]
// ]


    for (const [playerId, games] of Object.entries(playersGame)) {
      const name = playerNameById[playerId] || `Player ${playerId}`;

      if (!Array.isArray(games)) continue;

      for (const g of games) {
        rows.push({
          playerId,
          playerName: name,
          score: Number(g?.score ?? 0),
          level: g?.level ?? "",
          theme: g?.theme ?? "",
          misses: Number(g?.misses ?? 0),
          result: g?.result ?? "",
          lossReason: g?.lossReason ?? null,
          date: Number(g?.date ?? 0),
        });
      }
    }
    // [
    // { playerId: 123, playerName: "Ali", score: 10, level: "Easy", theme: "dog", misses: 2, result: "win",lossReason:'', date: 1700000000000 },
    //  { playerId: 456, playerName: "Sara", score: 5, level: "Hard", theme: "cat", misses: 4, result: "lose",lossReason:'', date: 1700000000500 } 
    //]

    // Sort by score DESC, then most recent DESC
    rows.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.date - a.date;
    });

    return rows;
  }, [playersGame, playerNameById]);

  // Group by player for per-player history display
  const gamesByPlayer = useMemo(() => {
    const map = {};

    for (const row of allGames) {
      if (!map[row.playerId]) map[row.playerId] = [];
      map[row.playerId].push(row);
    }

    return map;
  }, [allGames]);
//gamesByPlayer ={
//   "123": [game1, game2],
//   "456": [game1]
// }

  const top10 = allGames.slice(0, 10);

  return (
   <div className="page page-center">
      <h2>Leaderboard</h2>

      {allGames.length === 0 ? (
        <p>No games recorded yet. Play a game first.</p>
      ) : (
        <>
          <h3>Top 10 Scores</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Difficulty</th>
                <th>Theme</th>
                <th>Result</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((g, idx) => (
                <tr key={`${g.playerId}-${g.date}-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{g.playerName}</td>
                  <td>{g.score}</td>
                  <td>{g.level}</td>
                  <td>{g.theme}</td>
                  <td>{g.result}</td>
                  <td>{prettyReason(g.result, g.lossReason)}</td>
                  <td>{formatDate(g.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr style={{ margin: "1.5rem 0" }} />

          <h3>Players History</h3>
          {(playersData || []).map((p) => {
            const history = gamesByPlayer[String(p.id)] || [];

            return (
              <div key={p.id} style={{ marginBottom: "1.25rem" }}>
                <h4>
                  {p.name} (Games Played: {p.numberOfGames})
                </h4>

                {history.length === 0 ? (
                  <p>No recorded games for this player.</p>
                ) : (
                  <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Misses</th>
                        <th>Difficulty</th>
                        <th>Theme</th>
                        <th>Result</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history
                        .slice()
                        .sort((a, b) => b.date - a.date) // most recent first
                        .map((g, idx) => (
                          <tr key={`${p.id}-${g.date}-${idx}`}>
                            <td>{formatDate(g.date)}</td>
                            <td>{g.score}</td>
                            <td>{g.misses}</td>
                            <td>{g.level}</td>
                            <td>{g.theme}</td>
                            <td>{g.result}</td>
                            <td>{prettyReason(g.result, g.lossReason)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </>
      )}
      <hr />

      <button
        onClick={handleClear}
        style={{
          marginTop: "1rem",
          backgroundColor: "#c0392b",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        Clear All Data
      </button>
    </div>
    
  );
}
