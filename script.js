document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-btn');
    let boardState = Array(9).fill(null);  // Tracks board state
    let currentPlayer = 'X';  // Start with human (X)
    let gameOver = false;  // Flag to check if the game is over

    // Generate the game board with buttons
    function generateBoard() {
        board.innerHTML = ''; // Clear any existing content
        boardState.forEach((value, index) => {
            const button = document.createElement('button');
            button.classList.add('cell');
            button.innerText = value || ''; // If empty, show nothing
            button.disabled = value !== null || gameOver;  // Disable if the cell is filled or the game is over
            button.addEventListener('click', () => handleCellClick(index));
            board.appendChild(button);
        });
    }

    // Handle a click on a cell
    function handleCellClick(index) {
        if (gameOver || boardState[index]) return;

        boardState[index] = currentPlayer;
        generateBoard();

        if (checkWin(currentPlayer)) {
            if (currentPlayer === 'X') {
                alert('YOU WIN!');
            } else {
                alert('AI WINS!');
            }
            gameOver = true;
        } else if (boardState.every(cell => cell !== null)) {
            alert('It\'s a tie!');
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch player
            if (currentPlayer === 'O' && !gameOver) aiMove();  // AI's turn
        }
    }

    // AI move logic (basic)
    function aiMove() {
        if (gameOver) return;
        let emptyCells = boardState.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
        let randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardState[randomMove] = 'O';
        generateBoard();

        if (checkWin('O')) {
            alert('AI WINS!');
            gameOver = true;
        } else if (boardState.every(cell => cell !== null)) {
            alert('It\'s a tie!');
            gameOver = true;
        } else {
            currentPlayer = 'X';  // Switch back to human after AI move
        }
    }

    // Check for a winning combination
    function checkWin(player) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => 
            combination.every(index => boardState[index] === player)
        );
    }

    // Reset the game
    resetButton.addEventListener('click', () => {
        boardState = Array(9).fill(null);
        currentPlayer = 'X';  // Human always starts
        gameOver = false;
        generateBoard();
    });

    // Initialize the game board on page load
    generateBoard();
});
