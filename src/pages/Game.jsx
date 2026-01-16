import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useGame } from "../hooks/useGame";
import ScoreDisplay from "../components/ScoreDisplay";
import GameBoard from "../components/GameBoard";
import Timer from "../components/Timer";
import { usePlayer } from "../hooks/usePlayer";

export default function Game() {
  const {
    gameStatus,
    score,
    theme,
    setGameResult,
    maxMisses,
    misses,
    timeLeftMs,
  } = useGame();

  const { recordGameResult, incrementPlayerDataGames, player } = usePlayer();
  const didSaveRef = useRef(false);

  useEffect(() => {
    if (!player) return;

    const isFinished = gameStatus === "won" || gameStatus === "lost";
    if (!isFinished) return;

    if (didSaveRef.current) return;
    didSaveRef.current = true;

    let difficulty = "";
    if (maxMisses === 6) difficulty = "Easy";
    if (maxMisses === 4) difficulty = "Medium";
    if (maxMisses === 2) difficulty = "Hard";

    // Determine why the user lost (timeout vs misses)
    let lossReason = null;
    if (gameStatus === "lost") {
      const timedOut = typeof timeLeftMs === "number" && timeLeftMs <= 0;
      const outOfMisses = misses >= maxMisses;

      if (timedOut) lossReason = "timeout";
      else if (outOfMisses) lossReason = "misses";
      else lossReason = "unknown";
    }

    const newGameResult = {
      level: difficulty,
      theme,
      score,
      date: Date.now(),
      misses,
      result: gameStatus,
      lossReason, // null for wins, string for losses
    };

    setGameResult(newGameResult);
    incrementPlayerDataGames(player.id);
    recordGameResult(player.id, newGameResult);
  }, [
    gameStatus,
    player,
    maxMisses,
    theme,
    score,
    misses,
    timeLeftMs,
    setGameResult,
    incrementPlayerDataGames,
    recordGameResult,
  ]);

  if (gameStatus === "won" || gameStatus === "lost") {
    return <Navigate to="/game-over" replace />;
  }
return (
  <div className="page page-lower">
    <h3>Memorizing The Cards position</h3>
    <p>Player: {player?.name}</p>
    <ScoreDisplay />
    <GameBoard />
    <Timer />
  </div>
);
}
