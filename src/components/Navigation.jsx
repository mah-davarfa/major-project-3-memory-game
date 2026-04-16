import { NavLink } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";

export default function Navigation({ colorMode, onToggleColorMode }) {
  const { player } = usePlayer();

  return (
    <header className="top-shell">
      <h2 className="welcome-message">
        {player ? `${player.name} • ` : ""}Welcome to Kevin&apos;s Memory Game
      </h2>

      <div className="top-bar">
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
        </nav>

        <button type="button" onClick={onToggleColorMode} className="mode-toggle-btn">
          {colorMode === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </header>
  );
}
