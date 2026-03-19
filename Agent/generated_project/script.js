// Core game state and utility constants for Tic Tac Toe

// Player symbols
const PLAYER_X = 'X';
const PLAYER_O = 'O';

// Game board: 9 cells, each can be 'X', 'O', or null
let board = Array(9).fill(null);

// Current player (X starts)
let currentPlayer = PLAYER_X;

// Score tracking
let scores = {
    X: 0,
    O: 0,
};

// Game over flag
let gameOver = false;

// Cache DOM elements for later use
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const resetBtn = document.getElementById('resetBtn');

// Expose game state and utilities via the global window object for other modules
window.gameState = {
    PLAYER_X,
    PLAYER_O,
    board,
    currentPlayer,
    scores,
    boardEl,
    statusEl,
    scoreXEl,
    scoreOEl,
    resetBtn,
};

/**
 * Render the Tic Tac Toe board UI based on the current `board` array.
 * Creates missing cell buttons, updates their text, disables occupied cells,
 * and attaches click listeners.
 */
function renderBoard() {
    // Ensure board element exists
    if (!boardEl) return;

    // Iterate over each board index (0-8)
    for (let i = 0; i < board.length; i++) {
        // Try to find an existing cell button for this index
        let cell = boardEl.querySelector(`button[data-index="${i}"]`);
        // If the cell does not exist, create it and append to the board container
        if (!cell) {
            cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.index = i;
            boardEl.appendChild(cell);
        }
        // Update the visual content of the cell based on board state
        const value = board[i];
        cell.textContent = value ? value : '';
        // Add or remove the disabled class depending on whether the cell is occupied
        if (value) {
            cell.classList.add('disabled');
            // Optional: prevent further clicks via the disabled attribute
            cell.setAttribute('disabled', 'true');
        } else {
            cell.classList.remove('disabled');
            cell.removeAttribute('disabled');
        }
        // Attach click handler (if not already attached). Adding multiple listeners is harmless for this simple app.
        cell.addEventListener('click', handleCellClick);
    }
}

/**
 * Handle a click on a board cell.
 */
function handleCellClick(event) {
    if (gameOver) return; // ignore clicks after game ends
    const index = Number(event.target.dataset.index);
    if (board[index]) return; // cell already occupied

    // Update board state
    board[index] = currentPlayer;
    // Update UI for the clicked cell
    const cell = event.target;
    cell.textContent = currentPlayer;
    cell.classList.add('disabled');
    cell.setAttribute('disabled', 'true');

    // Check for win or draw
    const winningCombo = checkWin();
    if (winningCombo) {
        gameOver = true;
        // Highlight winning cells
        winningCombo.forEach(i => {
            const winCell = boardEl.querySelector(`button[data-index="${i}"]`);
            if (winCell) winCell.classList.add('win');
        });
        // Update status and scores
        if (statusEl) statusEl.textContent = `${currentPlayer} wins!`;
        scores[currentPlayer]++;
        updateScoreboard();
        return;
    }

    if (checkDraw()) {
        gameOver = true;
        if (statusEl) statusEl.textContent = 'Draw!';
        return;
    }

    // Switch player and update status
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    updateStatus();
}

/**
 * Check if the current board has a winning combination.
 * @returns {number[]|null} Array of winning indices or null if no win.
 */
function checkWin() {
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combo;
        }
    }
    return null;
}

/**
 * Determine if the game is a draw (board full with no winner).
 * @returns {boolean}
 */
function checkDraw() {
    return board.every(cell => cell !== null) && !checkWin();
}

/**
 * Update the status element to reflect the current game state.
 * Shows whose turn it is, or a win/draw message if applicable.
 */
function updateStatus() {
    if (!statusEl) return;
    statusEl.textContent = `${currentPlayer}'s turn`;
}

/**
 * Refresh the scoreboard UI with the latest scores.
 */
function updateScoreboard() {
    if (scoreXEl) scoreXEl.textContent = scores.X;
    if (scoreOEl) scoreOEl.textContent = scores.O;
}

/**
 * Reset the game board, turn and UI while preserving the scores.
 * This is used for starting a new round without reloading the page.
 */
function resetGame() {
    // Reset board array and game state variables
    board = Array(9).fill(null);
    currentPlayer = PLAYER_X;
    gameOver = false;

    // Update global reference for external modules
    window.gameState.board = board;
    window.gameState.currentPlayer = currentPlayer;

    // Remove any win highlight classes from cells
    const winCells = boardEl ? boardEl.querySelectorAll('.cell.win') : [];
    winCells.forEach(cell => cell.classList.remove('win'));

    // Remove "disabled" class and attributes from all cells, clear content
    const allCells = boardEl ? boardEl.querySelectorAll('.cell') : [];
    allCells.forEach(cell => {
        cell.classList.remove('disabled');
        cell.removeAttribute('disabled');
        cell.textContent = '';
    });

    // Re‑render the board (creates cells if they were removed) and update status
    renderBoard();
    updateStatus();
    // Scores are preserved; no need to update scoreboard here unless UI needs refresh
}

/**
 * Initialise or reset the game UI when the page first loads.
 * It clears any previous state and ensures the scoreboard reflects current scores.
 */
function initGame() {
    // Use resetGame to clear board and UI (preserves scores)
    resetGame();
    // Ensure scoreboard displays the current scores
    updateScoreboard();
}

// Initialise the UI once the DOM is ready
document.addEventListener('DOMContentLoaded', initGame);

// Reset button should also re‑initialise the game UI.
if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
}
