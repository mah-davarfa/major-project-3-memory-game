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

  const { addPlayer, player } = usePlayer();

  const [themePicked, setThemePicked] = useState(false);
  const [levelPicked, setLevelPicked] = useState(false);

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [nameInput, setNameInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");


  const apiMap = { dog: getDogs, cat: getCats, random: getRandom };

  // Reset once on mount if user comes back from mid-game
  useEffect(() => {
    if (gameStatus !== "idle" || cards.length > 0) {
      resetToStartAgain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


    useEffect(() => {
      setWelcomeMessage("");
    }, [nameInput]);

  const handlePlayerSubmit = () => {
    const name = nameInput.trim();
    if (!name) return;
    const result = addPlayer(name);

    if(result?.reused){
      setWelcomeMessage(`Welcome back, ${result.player.name}`);
    }else{
      setWelcomeMessage('')
    }
  };

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

  const deck = await apiMap[pick]();

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


  // Start game when all settings are ready
  useEffect(() => {
    if (themePicked && levelPicked && timeUserChoosed && player) {
      setGameStatus("playing");
      startGame();
      navigate("/game");
    }
  }, [themePicked, levelPicked, timeUserChoosed, player, setGameStatus, startGame, navigate]);

  return (
    <div>
      <div>
        <p className="instructions">
          When the game starts, all cards are face-up. Player get a few seconds to memorize positions.
          After the preview time ends, all cards flip face-down. From this point on, the game begins.
          rule:
          Player clicks a card → it flips face-up
          Player clicks a second card → it flips face-up
          Game checks match
          If match → stays face-up
          If not match → Auto flip back down,
          Player need to match all cards in limited time that they choose,
          Easy = up to 6 miss-Match, Medium = up to 4 miss-Match Hard = up to 2 miss-Match
        </p>

        <label>Enter Name</label>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button onClick={handlePlayerSubmit}>Save Player</button>
        {welcomeMessage && (
            <p className="welcome-message">{welcomeMessage}</p>
          )}

        <h3>Challenge your memory: choose the face‑up duration to memorize (seconds)</h3>
        <input
          type="number"
          value={choosenDelay/1000}
          min={1}
          onChange={(e) => setChoosenDelay(Number(e.target.value) * 1000)}
        />

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
        {error && <p style={{ color: "red" }}>{error}</p>}

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

      <div>
        <h2>How long do you need to finish the Game?</h2>
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

          <button
              type="submit"
              disabled={!player || loading || !!error || !themePicked || !levelPicked}
            >
              Start Game
          </button>

        </form>

        {!player && <p className="hint error">Please save a player name first.</p>}

      </div>
    </div>
  );
}
