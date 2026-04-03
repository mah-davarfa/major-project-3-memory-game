import { NavLink } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";

export default function Navigation() {
  const { player } = usePlayer();
  return (
    <>
    <h2 className="welcome-message ">{player ? player.name : ""} Welcome To Memory Match </h2>
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/leaderboard">Leaderboard</NavLink>
    </nav>
    </>

  );
}
