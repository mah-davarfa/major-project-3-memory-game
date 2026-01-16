# Memory Match Game 

A React-based memory card matching game built as a **mini-game project**.  
Players test their memory by matching card pairs under time and mistake constraints, with results saved locally and displayed on a leaderboard.

---

## Features

- Multiple difficulty levels (Easy / Medium / Hard)
- Theme selection (Dog, Cat, Random images via API)
- Timed gameplay with pause/resume
- Preview phase to memorize card positions
- Leaderboard with player history
- Persistent data using `localStorage`
- Clean UI with dark/light mode support

---

##  How to Play

1. **Enter Player Name**
   - A player name must be saved before starting the game.

2. **Preview Phase**
   - When the game starts, all cards are shown face-up.
   - You have a few seconds to memorize their positions.

3. **Gameplay Phase**
   - Cards flip face-down and the game begins.
   - Click one card → it flips face-up.
   - Click a second card:
     - If they match → both stay face-up.
     - If they do not match → both flip back down automatically.

4. **Winning & Losing**
   - Match all card pairs before time runs out **and** before exceeding allowed misses to win.
   - The game ends if:
     - Time reaches zero, or
     - Maximum allowed misses is exceeded.

---

## Timer & Pause Behavior

- The game includes a **Pause Timer** button.
- When paused:
  - The timer stops counting down.
  - **Card flipping is disabled**.
  - No score, miss, or game state changes can occur.
- When resumed:
  - Gameplay and timer continue normally.

This ensures fair play and protects leaderboard integrity.

---

##  Difficulty Levels

| Difficulty | Max Misses |
|-----------|------------|
| Easy      | 6          |
| Medium    | 4          |
| Hard      | 2          |

---

##  Themes

- **Dog** – Dog images from API
- **Cat** – Cat images from API
- **Random** – Random images

Selected buttons visually highlight to confirm the player’s choice.

---

##  Leaderboard

- Displays top 10 scores across all players.
- Shows detailed game history per player:
  - Date
  - Score
  - Difficulty
  - Theme
  - Result (Win / Loss)
  - Loss reason (Time ran out / Too many misses)

All data is stored locally using `localStorage`.

---

##  Architecture Overview

- **Pages**
  - `Home` – Game setup
  - `Game` – Active gameplay
  - `GameOver` – End-game summary
  - `Leaderboard` – Scores and history

- **Context**
  - `GameContext` – Core game state and rules
  - `PlayerContext` – Player and leaderboard data

- **Hooks**
  - `useGame` – Game logic
  - `useTimer` – Timer control
  - `useLocalStorage` – Persistent storage

---

##  Tech Stack

- React
- React Router
- Context API
- Custom Hooks
- CSS (Responsive + Dark Mode)
- External Image APIs

---

##  Getting Started


npm install
npm run dev

-- 
## Then open:
http://localhost:5173

