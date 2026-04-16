import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame";
import { usePlayer } from "../hooks/usePlayer";
import { getCats, getRandom, getDogs } from "../utils/buildDeck";

export default function GameSetup() {
  const navigate = useNavigate();

  const {
    createCardPairs,
    setCards,
    setMaxMisses,
    startGame,
    cards,
    setTheme,
    resetToStartAgain,
    setGameStatus,
    gameStatus,
    setTimeUserChoosed,
    timeUserChoosed,
    choosenDelay,
    setChoosenDelay,
  } = useGame();

  const { player } = usePlayer();

  const [themePicked, setThemePicked] = useState(false);
  const [levelPicked, setLevelPicked] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [count, setCount] = useState(5);

  const apiMap = { dog: getDogs, cat: getCats, random: getRandom };

  useEffect(() => {
    if (gameStatus !== "idle" || cards.length > 0) {
      resetToStartAgain();
    }
  }, []);

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    const ms = (minutes * 60 + seconds) * 1000;
    setTimeUserChoosed(ms);
  };

  const handleTheme = async (pick) => {
    setError("");
    setTheme(pick);
    setSelectedTheme(pick);
    setLoading(true);
    setThemePicked(false);

    const deck = await apiMap[pick](count);

    setLoading(false);

    if (!Array.isArray(deck)) {
      setError(deck?.message || "Failed to load images");
      setThemePicked(false);
      return;
    }

    if (deck.length === 0) {
      setError("No images returned from API");
      setThemePicked(false);
      return;
    }

    const newCards = createCardPairs(deck);
    setCards(newCards);
    setThemePicked(true);
  };

  const handleLevel = (max) => {
    setMaxMisses(max);
    setSelectedLevel(max);
    setLevelPicked(true);
  };

  useEffect(() => {
    if (themePicked && levelPicked && timeUserChoosed) {
      setGameStatus("playing");
      startGame();
      navigate("/game");
    }
  }, [themePicked, levelPicked, timeUserChoosed, setGameStatus, startGame, navigate]);

  return (
    <div className="setup-grid">
      <div className="card-section">
        <h2>Challenge Yourself</h2>
        <p>
          {player?.name
            ? `Leaderboard player: ${player.name}`
            : "You can play as guest, then submit your score after game over."}
        </p>
      </div>

      <div className="card-section">
        <h3>Challenge your memory: choose the face-up duration to memorize (seconds)</h3>
        <input
          type="number"
          value={choosenDelay / 1000}
          min={1}
          onChange={(e) => setChoosenDelay(Number(e.target.value) * 1000)}
        />

        <h3>Choose number of pairs (2–10) — total cards: {count * 2}</h3>
        <input
          type="number"
          value={count}
          min={2}
          max={10}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>

      <div className="card-section">
        <h3>Pick your Theme</h3>
        <button
          className={`btn-choice ${selectedTheme === "dog" ? "is-selected" : ""}`}
          onClick={() => handleTheme("dog")}
          disabled={loading}
        >
          Dog
        </button>

        <button
          className={`btn-choice ${selectedTheme === "cat" ? "is-selected" : ""}`}
          onClick={() => handleTheme("cat")}
          disabled={loading}
        >
          Cat
        </button>

        <button
          className={`btn-choice ${selectedTheme === "random" ? "is-selected" : ""}`}
          onClick={() => handleTheme("random")}
          disabled={loading}
        >
          Random
        </button>

        {loading && <p>Loading cards...</p>}
        {error && <p className="hint error">{error}</p>}
      </div>

      <div className="card-section">
        <h3>Pick difficulty (max misses)</h3>
        <button
          className={`btn-choice ${selectedLevel === 6 ? "is-selected" : ""}`}
          onClick={() => handleLevel(6)}
        >
          Easy
        </button>
        <button
          className={`btn-choice ${selectedLevel === 4 ? "is-selected" : ""}`}
          onClick={() => handleLevel(4)}
        >
          Medium
        </button>
        <button
          className={`btn-choice ${selectedLevel === 2 ? "is-selected" : ""}`}
          onClick={() => handleLevel(2)}
        >
          Hard
        </button>
      </div>

      <div className="card-section">
        <h2>How long do you need to finish the game?</h2>
        <form onSubmit={handleTimeSubmit}>
          <label>Minutes:</label>
          <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
            {[0, 1, 2, 3, 4].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label>Seconds:</label>
          <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
            {Array.from({ length: 60 }, (_, i) => i).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading || !!error || !themePicked || !levelPicked}>
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}
