import { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const PlayerContext = createContext();

export function PlayerContextProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [playersData, setPlayersData] = useLocalStorage("playersData", []);
  const [playersGame, setPlayersGame] = useLocalStorage("playersGame", {});

  const clearPlayerStorage = () => {
    localStorage.removeItem("playersData");
    localStorage.removeItem("playersGame");
    setPlayersData([]);
    setPlayersGame({});
    setPlayer(null);
  };

  const addPlayer = (name) => {
    const normalized = String(name || "").trim();
    if (!normalized) return { ok: false, reason: "empty" };

    const existing = (playersData || []).find(
      (p) => String(p?.name || "").trim().toLowerCase() === normalized.toLowerCase()
    );

    if (existing) {
      setPlayer(existing);
      return { ok: true, reused: true, player: existing };
    }

    const newPlayer = {
      name: normalized,
      id: Date.now(),
      numberOfGames: 0,
    };

    setPlayer(newPlayer);
    setPlayersData((prev) => [...prev, newPlayer]);
    return { ok: true, reused: false, player: newPlayer };
  };

  const incrementPlayerDataGames = (playerId) => {
    setPlayersData((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, numberOfGames: p.numberOfGames + 1 } : p
      )
    );
  };

  const recordGameResult = (playerId, gameResult) => {
    setPlayersGame((prev) => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), gameResult],
    }));
  };

  const saveGameForLeaderboard = (name, gameResult) => {
    const result = addPlayer(name);
    if (!result?.ok || !result.player) return result;

    incrementPlayerDataGames(result.player.id);
    recordGameResult(result.player.id, gameResult);

    return { ok: true, player: result.player, reused: result.reused };
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
        playersData,
        addPlayer,
        incrementPlayerDataGames,
        playersGame,
        recordGameResult,
        saveGameForLeaderboard,
        clearPlayerStorage,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
