# Tic Tac Toe Web App

## Overview
A simple, responsive Tic Tac Toe game that runs entirely in the browser. Players take turns clicking on a 3×3 grid to place **X** or **O**. The app tracks scores across multiple rounds, highlights winning combinations, and provides a reset button to start a new game without losing the score.

## Tech Stack
- **HTML** – Structure of the page (`index.html`).
- **CSS** – Styling, responsive layout, hover effects, and win highlighting (`style.css`).
- **JavaScript** – Game logic, UI rendering, score tracking, and event handling (`script.js`).

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **Open the game**
   Open `index.html` in any modern web browser (no server required).

## Game Rules & UI Features
- Two players alternate turns, starting with **X**.
- Click an empty cell to place your symbol.
- The first player to align three of their symbols horizontally, vertically, or diagonally wins the round.
- If all nine cells are filled without a winner, the round ends in a draw.
- **Scoreboard** – Tracks the total wins for X and O across rounds.
- **Responsive Board** – The grid scales to fit the viewport on desktop and mobile devices.
- **Hover Effects** – Cells show a subtle highlight when hovered, indicating they are clickable.
- **Win Highlight** – Winning cells are highlighted with a distinct style.
- **Reset Button** – Clears the board for a new round while preserving the scores.

## File Overview
| File | Purpose |
|------|---------|
| `index.html` | Page markup; loads the CSS and JavaScript files and defines the UI containers (title, scoreboard, board, status, reset button). |
| `style.css` | Styles for the layout, responsive grid, hover effects, disabled/active states, and win highlighting. |
| `script.js` | Core game logic: board state, player turns, win/draw detection, score tracking, UI rendering, and event handling. |

## Screenshot
> ![Tic Tac Toe Screenshot](path/to/screenshot.png)
> *Placeholder for a screenshot of the game UI.*

---
Enjoy playing! Feel free to fork and enhance the game (e.g., add AI opponent, animation, or persistent storage).
