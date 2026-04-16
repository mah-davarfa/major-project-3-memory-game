import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useGame } from "../hooks/useGame";
import { usePlayer } from "../hooks/usePlayer";

function prettyReason(lossReason) {
  if (lossReason === "timeout") return "Time ran out";
  if (lossReason === "misses") return "Too many misses";
  return "Game ended";
}

export default function GameOver() {
  const navigate = useNavigate();
  const { gameStatus, gameResult, resetToStartAgain } = useGame();
  const { player, saveGameForLeaderboard } = usePlayer();

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  const isWin = gameStatus === "won";
  const title = isWin ? "Great Job!" : "Lost! Try Again";

  const details = useMemo(() => {
    if (!gameResult) return null;
    return {
      theme: gameResult.theme,
      level: gameResult.level,
      score: gameResult.score,
      misses: gameResult.misses,
      result: gameResult.result,
      lossReason: gameResult.lossReason,
    };
  }, [gameResult]);

  const goToSetupHome = () => {
    resetToStartAgain();
    navigate("/");
  };

  const handleSubmitYes = () => {
    setError("");

    if (player?.name) {
      saveGameForLeaderboard(player.name, gameResult);
      goToSetupHome();
      return;
    }

    setIsNameModalOpen(true);
  };

  const handleSaveName = () => {
    const cleanName = nameInput.trim();
    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    saveGameForLeaderboard(cleanName, gameResult);
    setNameInput("");
    setIsNameModalOpen(false);
    goToSetupHome();
  };

  const handleNo = () => {
    goToSetupHome();
  };

  return (
    <div className="page page-center game-over-card">
      <h2>{title}</h2>

      {details ? (
        <div className="result-summary card-section">
          <p>Difficulty: {details.level}</p>
          <p>Theme: {details.theme}</p>
          <p>Correct pairs: {details.score}</p>
          <p>Wrong picks: {details.misses}</p>
          <p>Result: {details.result}</p>
          {!isWin ? <p>Reason: {prettyReason(details.lossReason)}</p> : null}
        </div>
      ) : null}

      <h3>Would you like to Submit for Leaderboard?</h3>

      <div className="game-over-actions">
        <button type="button" onClick={handleSubmitYes}>
          Yes
        </button>
        <button type="button" onClick={handleNo}>
          No
        </button>
      </div>

      {isNameModalOpen && (
        <Modal title="Submit to Leaderboard" onClose={() => setIsNameModalOpen(false)}>
          <div className="leaderboard-modal-body">
            <label htmlFor="leaderboard-name">Enter your name</label>
            <input
              id="leaderboard-name"
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setError("");
              }}
            />

            {error ? <p className="hint error">{error}</p> : null}

            <div className="modal-actions-row">
              <button type="button" onClick={handleSaveName}>
                Save Score
              </button>
              <button type="button" onClick={() => setIsNameModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
