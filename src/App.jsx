import { Route, Routes } from "react-router-dom";
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
  return (
    <div className="app-shell">
      <PlayerContextProvider>
        <GameProvider>
          <Navigation />

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
