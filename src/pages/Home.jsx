import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GameSetup from "../components/GameSetup";
import Modal from "../components/Modal";
import { useGame } from "../hooks/useGame";
import { getRandom } from "../utils/buildDeck";

export default function Home() {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [loadingIntroGame, setLoadingIntroGame] = useState(false);
  const [introError, setIntroError] = useState("");
 
  const {
    hasUnlockedSetupHome,
    setHasUnlockedSetupHome,
    createCardPairs,
    setCards,
    setMaxMisses,
    setTheme,
    setTimeUserChoosed,
    setChoosenDelay,
    setGameStatus,
    startGame,
    resetToStartAgain,
  } = useGame();

  const handleIntroStart = async () => {
    setIntroError("");
    setLoadingIntroGame(true);

    resetToStartAgain();
    setHasUnlockedSetupHome(true);
    setChoosenDelay(10000);
    setMaxMisses(4);
    setTheme("random");
    setTimeUserChoosed(30000);

    const deck = await getRandom(6);
    setLoadingIntroGame(false);

    if (!Array.isArray(deck)) {
      setIntroError(deck?.message || "Failed to load the starter game.");
      return;
    }

    const newCards = createCardPairs(deck);
    setCards(newCards);
    setGameStatus("playing");
    startGame();
    navigate("/game");
  };

  if (!hasUnlockedSetupHome) {
    return (
      <div className="page intro-page">
        <div className="intro-card">
          <h1>Welcome to Kevin&apos;s Memory Game</h1>

          <p className="intro-copy">
            This App demonstrates how to improves cognitive performance by training:
          </p>

          <p className="instructions-1 intro-list">
            1. Working memory
            <br />
            2. Visual-spatial memory
            <br />
            3. Selective attention
            <br />
            4. Processing speed
            <br />
            5. Error-based learning
            <br />
            6. Motivation and engagement
          </p>

          <div className="intro-actions">
            <button type="button" onClick={() => setIsAboutModalOpen(true)}>
              How to Play
            </button>
            <button type="button" onClick={handleIntroStart} disabled={loadingIntroGame}>
              {loadingIntroGame ? "Loading..." : "Start Game"}
            </button>
          </div>

          {introError ? <p className="hint error">{introError}</p> : null}
        </div>

        {isAboutModalOpen && (
          <Modal
            title="How to Play Memory Game"
            onClose={() => {
              setIsAboutModalOpen(false);
            }}
          >
            <div className="page page-lower">
               <p className="instructions page">

                      When the game starts, all cards are face-up. Player gets a few
                      seconds to memorize positions. After the preview time ends, all
                      cards flip face-down. From this point on, the game begins.
                    </p>

                    <p>
                        Player clicks a card → it flips face-up.
                        <br />
                        Player clicks a second card → it flips face-up.
                        <br />
                        Game checks match.
                        <br />
                        If match → stays face-up.
                        <br />
                        If not match → auto flips back down.
                        <br />
                        Player needs to match all cards in the time they choose.
                        <br />
                        Easy = up to 6 mismatches, Medium = up to 4 mismatches, Hard = up
                        to 2 mismatches.
                    </p>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="page page-lower">
      <GameSetup />
    </div>
  );
}
