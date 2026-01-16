import { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const PlayerContext = createContext();

export function PlayerContextProvider({ children }) {
  const [player, setPlayer] = useState(null);//{ name: "", id: "", numberOfGames: 0 }

  const [playersData, setPlayersData] = useLocalStorage("playersData", []);//[{player1},{player2},... ] or  [ { name: "Ali", id: 123, numberOfGames: 3 }, { name: "Sara", id: 456, numberOfGames: 1 } ]
  const [playersGame, setPlayersGame] = useLocalStorage("playersGame", {});//{playerId:{}} or { 123: [ { score: 10, difficulty: "Easy", theme: "dog", date: "...", misses: 2, result: "win" }, ... ], 456: [ { score: 5, difficulty: "Hard", theme: "cat", date: "...", misses: 4, result: "lose" } ] }
  const clearPlayerStorage=()=>{
    localStorage.removeItem('playersData')
    localStorage.removeItem('playersGame')
    setPlayersData([]);
    setPlayersGame({});
    setPlayer(null);
  }
  // Add a new player
  const addPlayer = (name) => {
    const newPlayer = {
      name,
      id: Date.now(),
      numberOfGames:0
    };

    setPlayer(newPlayer);   

    setPlayersData((prev) => [...prev, newPlayer]);
  };

  // Increment number of games for current player
  const incrementPlayerDataGames = (playerId) => {
    setPlayersData((prev) =>
      prev.map((p) =>                             //numberOfGames: numberOfGames +1 
        p.id === playerId ? { ...p, numberOfGames: p.numberOfGames + 1 } : p
      )                                           //numberOfGames: p[numberOfGames] + 1 
    );
  };
                                            //result
  // Record a game result  { 123: [ { score: 10, difficulty: "Easy", theme: "dog", date: "...", misses: 2, result: "win" }, {...}]
  const recordGameResult = (playerId, gameResult) => {
    setPlayersGame((prev) => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), gameResult]
    }));
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
        clearPlayerStorage
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
