from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Game board initialization
board = [""] * 9
current_player = "X"

# Winning combinations
WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
    [0, 4, 8], [2, 4, 6]  # Diagonals
]

# Function to check winner
def check_winner():
    for pattern in WIN_PATTERNS:
        a, b, c = pattern
        if board[a] and board[a] == board[b] == board[c]:
            return "Human Wins" if board[a] == "X" else "AI Wins"  # Updated labels
    return "Draw" if "" not in board else None  # Draw if board is full

# Minimax algorithm for AI
def minimax(board, depth, is_maximizing):
    winner = check_winner()
    if winner:
        return {"Human Wins": -10, "AI Wins": 10, "Draw": 0}[winner]

    if is_maximizing:
        best_score = -float("inf")
        for i in range(9):
            if board[i] == "":
                board[i] = "O"
                score = minimax(board, depth + 1, False)
                board[i] = ""
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float("inf")
        for i in range(9):
            if board[i] == "":
                board[i] = "X"
                score = minimax(board, depth + 1, True)
                board[i] = ""
                best_score = min(score, best_score)
        return best_score

# AI selects the best move
def get_best_move():
    best_score = -float("inf")
    move = -1
    for i in range(9):
        if board[i] == "":
            board[i] = "O"
            score = minimax(board, 0, False)
            board[i] = ""
            if score > best_score:
                best_score = score
                move = i
    return move

# Player move API
@app.route("/move", methods=["POST"])
def make_move():
    global current_player

    data = request.json
    index = data["index"]

    if board[index] == "" and current_player == "X":
        board[index] = "X"
        current_player = "O"

        # AI Move
        ai_move = get_best_move()
        if ai_move != -1:
            board[ai_move] = "O"
            current_player = "X"

    return jsonify({"board": board, "winner": check_winner()})

# Reset game API
@app.route("/reset", methods=["POST"])
def reset_game():
    global board, current_player
    board = [""] * 9
    current_player = "X"
    return jsonify({"board": board})

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
