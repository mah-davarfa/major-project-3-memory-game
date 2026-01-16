import { createContext, useState, useEffect, useRef, useCallback, useMemo } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
 
  
  const [gameStatus, setGameStatus] = useState("idle");// idle | playing | won | lost

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);// [card1,card2]
  const [misses, setMisses] = useState(0);
  const [maxMisses, setMaxMisses] = useState(5);
  const [isBusy, setIsBusy] = useState(false);
  const [score, setScore] = useState(0);

  const [theme, setTheme] = useState("");
  const [timeUserChoosed, setTimeUserChoosed] = useState(null);

  // Your “blink duration” (delay before checking two flipped cards)
  const [choosenDelay, setChoosenDelay] = useState(1000);

  // Persistable game result (for leaderboard/player record)
  const [gameResult, setGameResult] = useState(null);

  // Timer snapshot for UI across components (ms)
  const [timeLeftMs, setTimeLeftMs] = useState(null);
  const [isGamePaused, setIsGamePaused] = useState(false);

  // --- helpers --- Fisher–Yates shuffle,
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
////duplicating each card
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
  // --- safe settimeout gets all ids aftere any renders ---/////
  const timeoutIds = useRef([]);

  const safeTimeout = useCallback((callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutIds.current.push(id);
    return id;
  }, []);
  //clean up all ids for setTimeout
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => clearTimeout(id));
      timeoutIds.current = [];
    };
  }, []);
//////////////////////////////////////
  const endGame = useCallback((result) => {

    setGameStatus(result);// result: "won" or "lost"
  }, []);
//////////cards flip face up for preiod of time user memmorize cards positions
  const tempFacesUp = useCallback(() => {
    setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));

    safeTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
    }, choosenDelay);
  }, [safeTimeout,choosenDelay]);

  const checkIfTwoCardsMatches = useCallback(
    (newFlippedCards, latestCards) => {
      const [c1, c2] = newFlippedCards;
      //if they are match keep them flip up 
      if (c1.matchKey === c2.matchKey) {
        const updatedCards = latestCards.map((c) =>
          c.matchKey === c1.matchKey ? { ...c, isMatched: true } : c
        );

        setCards(updatedCards);

        const allMatched = updatedCards.every((c) => c.isMatched);
        if (allMatched) {
          endGame("won");
        } else {
          // safeTimeout(() => {
          //   tempFacesUp();
          //   setIsBusy(false);
          // }, 800);
          setIsBusy(false);
        }
        setIsBusy(false);
        setScore((prev) => prev + 1);
      } else {
        //flip back the 2 cards when they are not same
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

          // safeTimeout(() => {
          //   tempFacesUp();
          //   setIsBusy(false);
          // }, 800);
          return totalLost;
        });
        setIsBusy(false);
      }

      setFlippedCards([]);
    },
    [ endGame, maxMisses]
  );

  

const flipCard = useCallback(
  (cardId) => {
    if (isBusy) return;

    // Find from latest cards snapshot
    const selected = cards.find((c) => c.cardId === cardId);
    if (!selected || selected.isFlipped || selected.isMatched) return;

    // Flip visually
    setCards((prev) =>
      prev.map((c) => (c.cardId === cardId ? { ...c, isFlipped: true } : c))
    );

    setFlippedCards((prev) => {
      const next = [...prev, selected];

      // If this is the 2nd card, schedule exactly once
      if (next.length === 2) {
        // HARD GUARD: prevent double scheduling
        if (pairCheckPendingRef.current) return prev; // ignore duplicate path
        pairCheckPendingRef.current = true;

        setIsBusy(true);

        // Use a safe latestCards snapshot
        const latestCards = cards.map((c) =>
          c.cardId === cardId ? { ...c, isFlipped: true } : c
        );

        safeTimeout(() => {
          checkIfTwoCardsMatches(next, latestCards);
          pairCheckPendingRef.current = false; // release lock after check
        }, 800);
      } else {
        // First card: do not lock board
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
  }, []);

  // Derived (human-readable) timer for UI using useMemo() because only runs when timeLeftMs changes not on every render
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
        // core state
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

        // game settings
        theme,
        setTheme,
        timeUserChoosed,
        setTimeUserChoosed,
        choosenDelay,
        setChoosenDelay,

        // timer snapshot + formatted
        timeLeftMs,
        setTimeLeftMs,
        formattedTimeLeft,

        // actions
        createCardPairs,
        flipCard,
        startGame,
        endGame,
        tempFacesUp,
        resetToStartAgain,

        // results
        gameResult,
        setGameResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
