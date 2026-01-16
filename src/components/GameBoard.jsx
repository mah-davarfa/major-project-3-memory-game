import { useGame } from "../hooks/useGame";
import Card from "./Card";

export default function GameBoard() {
  const { cards } = useGame();

  return (
    <div>
      {cards.map(card => (
        <Card
          key={card.cardId}
          cardId={card.cardId}
          url={card.url}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
        />
      ))}
    </div>
  );
}
