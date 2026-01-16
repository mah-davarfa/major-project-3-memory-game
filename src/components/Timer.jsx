import { useEffect } from "react";
import useTimer from "../hooks/useTimer";
import { useGame } from "../hooks/useGame";

export default function Timer() {
  const { timeUserChoosed, gameStatus, setTimeLeftMs, endGame,setIsGamePaused } = useGame();

  const { timeLeft, isPaused, isRunning, start, reset, togglePause, format } =
    useTimer(timeUserChoosed || 0);

  const handleTogglePause = () => {
  togglePause(); // from useTimer
  setIsGamePaused(prev => !prev);
}

  // Start/reset based on gameStatus
  useEffect(() => {
    if (gameStatus === "playing" && !isRunning) {
      start(timeUserChoosed || 0);
    }

    if (gameStatus !== "playing" && isRunning) {
      reset();
    }
  }, [gameStatus, isRunning, start, reset, timeUserChoosed]);

  // Share timer snapshot globally so ScoreDisplay / other components can read it
  useEffect(() => {
    setTimeLeftMs(timeLeft);
  }, [timeLeft, setTimeLeftMs]);

  // If timer hits 0 while playing, lose the game
  useEffect(() => {
    if (gameStatus === "playing" && isRunning && timeLeft <= 0) {
      endGame("lost");
    }
  }, [timeLeft, gameStatus, isRunning, endGame]);

  return (
    <>
      <p>Time left</p>
      <p>{format(timeLeft)}</p>

    <button onClick={handleTogglePause} disabled={!isRunning}>
      {isPaused ? "Resume Timer" : "Pause Timer"}
    </button>
    </>
  );
}
