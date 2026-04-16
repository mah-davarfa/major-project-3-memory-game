import { createContext, useState, useEffect, useRef, useCallback, useMemo } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameStatus, setGameStatus] = useState("idle");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [misses, setMisses] = useState(0);
  const [maxMisses, setMaxMisses] = useState(5);
  const [isBusy, setIsBusy] = useState(false);
  const [score, setScore] = useState(0);

  const [theme, setTheme] = useState("");
  const [timeUserChoosed, setTimeUserChoosed] = useState(null);
  const [choosenDelay, setChoosenDelay] = useState(5000);
  const [gameResult, setGameResult] = useState(null);
  const [timeLeftMs, setTimeLeftMs] = useState(null);
  const [isGamePaused, setIsGamePaused] = useState(false);
   const [hasUnlockedSetupHome, setHasUnlockedSetupHome] = useState(false);

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createCardPairs(images) {
    const timestamp = Date.now();
    const pairs = images.flatMap((img, index) => {
      const matchKey = `match-${index}-${timestamp}`;
      return [
        {
          cardId: `card-${index}-a-${timestamp}`,
          matchKey,
          url: img.url,
          isFlipped: false,
          isMatched: false,
        },
        {
          cardId: `card-${index}-b-${timestamp}`,
          matchKey,
          url: img.url,
          isFlipped: false,
          isMatched: false,
        },
      ];
    });

    return shuffle(pairs);
  }

  const pairCheckPendingRef = useRef(false);
  const timeoutIds = useRef([]);

  const safeTimeout = useCallback((callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutIds.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => clearTimeout(id));
      timeoutIds.current = [];
    };
  }, []);

  const endGame = useCallback((result) => {
    setGameStatus(result);
  }, []);

  const tempFacesUp = useCallback(() => {
    setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));

    safeTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
    }, choosenDelay);
  }, [safeTimeout, choosenDelay]);

  const checkIfTwoCardsMatches = useCallback(
    (newFlippedCards, latestCards) => {
      const [c1, c2] = newFlippedCards;

      if (c1.matchKey === c2.matchKey) {
        const updatedCards = latestCards.map((c) =>
          c.matchKey === c1.matchKey ? { ...c, isMatched: true } : c
        );

        setCards(updatedCards);

        const allMatched = updatedCards.every((c) => c.isMatched);
        if (allMatched) {
          endGame("won");
        } else {
          setIsBusy(false);
        }

        setIsBusy(false);
        setScore((prev) => prev + 1);
      } else {
        setCards((prev) =>
          prev.map((c) =>
            c.cardId === c1.cardId || c.cardId === c2.cardId
              ? { ...c, isFlipped: false }
              : c
          )
        );

        setMisses((prev) => {
          const totalLost = prev + 1;

          if (totalLost === maxMisses) {
            endGame("lost");
            return totalLost;
          }

          return totalLost;
        });
        setIsBusy(false);
      }

      setFlippedCards([]);
    },
    [endGame, maxMisses]
  );

  const flipCard = useCallback(
    (cardId) => {
      if (isBusy) return;

      const selected = cards.find((c) => c.cardId === cardId);
      if (!selected || selected.isFlipped || selected.isMatched) return;

      setCards((prev) =>
        prev.map((c) => (c.cardId === cardId ? { ...c, isFlipped: true } : c))
      );

      setFlippedCards((prev) => {
        const next = [...prev, selected];

        if (next.length === 2) {
          if (pairCheckPendingRef.current) return prev;
          pairCheckPendingRef.current = true;

          setIsBusy(true);

          const latestCards = cards.map((c) =>
            c.cardId === cardId ? { ...c, isFlipped: true } : c
          );

          safeTimeout(() => {
            checkIfTwoCardsMatches(next, latestCards);
            pairCheckPendingRef.current = false;
          }, 800);
        } else {
          setIsBusy(false);
        }

        return next;
      });
    },
    [cards, checkIfTwoCardsMatches, isBusy, safeTimeout]
  );

  const startGame = useCallback(() => {
    tempFacesUp();
  }, [tempFacesUp]);

  const resetToStartAgain = useCallback(() => {
    setCards([]);
    setFlippedCards([]);
    setIsBusy(false);
    setScore(0);
    setMisses(0);
    setMaxMisses(5);
    setTheme("");
    setGameStatus("idle");
    setTimeUserChoosed(null);
    setGameResult(null);
    setTimeLeftMs(null);
    // setHasUnlockedSetupHome(false);
    setIsGamePaused(false);
  }, []);

  const formattedTimeLeft = useMemo(() => {
    if (timeLeftMs == null) return "--:--";
    const totalSeconds = Math.floor(Math.max(timeLeftMs, 0) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [timeLeftMs]);

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        setGameStatus,
        cards,
        setCards,
        flippedCards,
        setFlippedCards,
        isBusy,
        setIsBusy,
        misses,
        setMisses,
        maxMisses,
        setMaxMisses,
        score,
        setScore,
        isGamePaused,
        setIsGamePaused,
        theme,
        setTheme,
        timeUserChoosed,
        setTimeUserChoosed,
        choosenDelay,
        setChoosenDelay,
        timeLeftMs,
        setTimeLeftMs,
        formattedTimeLeft,
        hasUnlockedSetupHome,
        setHasUnlockedSetupHome,
        createCardPairs,
        flipCard,
        startGame,
        endGame,
        tempFacesUp,
        resetToStartAgain,
        gameResult,
        setGameResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
