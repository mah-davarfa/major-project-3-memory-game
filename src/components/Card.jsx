import { useGame } from "../hooks/useGame";
import backImg from "../assets/OIP.jpg";

export default function Card({ cardId, url, isFlipped, isMatched }) {
  const { isBusy, isGamePaused, flipCard } = useGame();

const handleFlip = () => {
  if (isBusy || isGamePaused || isMatched || isFlipped) return;
  flipCard(cardId);
};


  return (
      <button
      onClick={handleFlip}
      disabled={isBusy || isFlipped || isMatched}
      className={`card ${isFlipped ? "flipped" : ""}`}
    >
       <img
        src={(isFlipped || isMatched ) ? url : backImg}
        alt={`card-${cardId}`}
        width={300}
      />
    </button>
  );
}
