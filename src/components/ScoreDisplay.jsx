import { useGame } from "../hooks/useGame";

export default function ScoreDisplay() {
  const { gameStatus, misses, maxMisses, score, formattedTimeLeft } = useGame();

  return (
    <div>
      <p>Status: {gameStatus}</p>
      <p>
        Wrong picks: {misses} / {maxMisses}
      </p>
      <p>Correct pairs: {score}</p>
      <p>Count Down: {formattedTimeLeft}</p>
    </div>
  );
}
