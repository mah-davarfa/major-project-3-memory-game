import { Route, Routes } from "react-router-dom";
import {useState, useEffect} from 'react';
import Navigation from "./components/Navigation";
import { PlayerContextProvider } from "./Context/PlayerContext";
import { GameProvider } from "./Context/GameContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import GameOver from "./pages/GameOver";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import "./App.css";


function App() {
    const [colorMode, setColorMode] = useState(
    () => localStorage.getItem("memory-game-color-mode") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("memory-game-color-mode", colorMode);
    document.documentElement.setAttribute("data-theme", colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-shell">
      
      <PlayerContextProvider>
       <GameProvider>
          <Navigation colorMode={colorMode} onToggleColorMode={toggleColorMode} />

          <main className="page-shell">
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
                <Route path="/game-over" element={<GameOver />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </GameProvider>
      </PlayerContextProvider>
    </div>
  );
}

export default App;
