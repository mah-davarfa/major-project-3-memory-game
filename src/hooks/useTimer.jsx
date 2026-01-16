import { useEffect, useRef, useState, useCallback } from "react";

export default function useTimer(initialDurationMs = 0) {
  const [timeLeft, setTimeLeft] = useState(initialDurationMs);
  const [isPaused, setIsPaused] = useState(true);     // start paused by default
  const [isRunning, setIsRunning] = useState(false);

  const endAtRef = useRef(null);
  const timeoutRef = useRef(null);

  const clearTick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback((durationMs = initialDurationMs) => {
    const d = Math.max(Number(durationMs) || 0, 0);
    setTimeLeft(d); //duration of countDown
    endAtRef.current = Date.now() + d; //timeStamp
    setIsPaused(false);
    setIsRunning(true);
  }, [initialDurationMs]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsPaused(true);
  }, [isRunning]);

  const resume = useCallback(() => {
    if (!isRunning) return;
    setIsPaused(false);
    endAtRef.current = Date.now() + timeLeft;
  }, [isRunning, timeLeft]);
//reset at start 
  const reset = useCallback(() => {
    clearTick();
    setTimeLeft(initialDurationMs);
    setIsPaused(true);
    setIsRunning(false);
    endAtRef.current = null;
  }, [clearTick, initialDurationMs]);

  // Keep local timeLeft in sync if initialDuration changes AND timer isn't running
  useEffect(() => {
    if (!isRunning) setTimeLeft(initialDurationMs);
  }, [initialDurationMs, isRunning]);
///engine running count Down
  useEffect(() => {
    clearTick();

    if (!isRunning) return;
    if (isPaused) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const remaining = Math.max(endAtRef.current  - Date.now(), 0);
      setTimeLeft(remaining);
    }, 1000);

    return clearTick;
  }, [timeLeft, isPaused, isRunning, clearTick]);
//pause and play
  const togglePause = useCallback(() => {
    if (!isRunning) return;
    if (isPaused) resume();
    else pause();
  }, [isRunning, isPaused, pause, resume]);
//display countDown
  const format = useCallback((ms) => {
    const totalSeconds = Math.floor((Math.max(ms, 0)) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  return {
    timeLeft,
    isPaused,
    isRunning,
    start,
    pause,
    resume,
    reset,
    togglePause,
    format,
  };
}
