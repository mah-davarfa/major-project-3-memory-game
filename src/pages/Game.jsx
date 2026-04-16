import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useGame } from "../hooks/useGame";
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

  const { player } = usePlayer();
  const didSaveRef = useRef(false);

  useEffect(() => {
    const isFinished = gameStatus === "won" || gameStatus === "lost";
    if (!isFinished) return;

    if (didSaveRef.current) return;
    didSaveRef.current = true;

    let difficulty = "";
    if (maxMisses === 6) difficulty = "Easy";
    if (maxMisses === 4) difficulty = "Medium";
    if (maxMisses === 2) difficulty = "Hard";

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
      lossReason,
    };

    setGameResult(newGameResult);
  }, [gameStatus, maxMisses, theme, score, misses, timeLeftMs, setGameResult]);

  if (gameStatus === "won" || gameStatus === "lost") {
    return <Navigate to="/game-over" replace />;
  }

  return (
    <div className="page page-lower">
      <div className="game-header">
        <span>Player: {player?.name || "Guest"}</span>
        <span>Theme: {theme || "Random"}</span>
        <span>Score: {score}</span>
        <span>
          Misses: {misses}/{maxMisses}
        </span>
      </div>

      <Timer />
      <GameBoard />
    </div>
  );
}
