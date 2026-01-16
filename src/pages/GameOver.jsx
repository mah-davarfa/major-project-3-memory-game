import { useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame";

export default function GameOver() {
  const navigate = useNavigate();
  const { gameStatus, score, misses, resetToStartAgain, theme } = useGame();

  const isWin = gameStatus === "won";
  const title = isWin ? "You Won!" : "Game Over";

  const handlePlayAgain = () => {
    resetToStartAgain();
    navigate("/");
  };

  return (
    <div className="page page-lower">
      <h2>{title}</h2>
      <p>Theme: {theme}</p>
      <p>Result: {gameStatus}</p>
      <p>Correct pairs: {score}</p>
      <p>Wrong picks: {misses}</p>
      <button onClick={handlePlayAgain}>Play Again</button>
      <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
    </div>
  );
}
