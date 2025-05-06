import Game from '../models/Game.js';
import User from '../models/User.js';

// @desc    Create a new game
// @route   POST /api/games
// @access  Private
export const createGame = async(req, res) => {
    try {
        const { isPublic } = req.body;

        // Create a new game with the current user as player1
        const game = await Game.create({
            player1: req.user.id,
            isPublic: isPublic || false,
            status: 'waiting'
        });

        await game.populate('player1', 'username');

        res.status(201).json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Join a game by code
// @route   PUT /api/games/join/:gameCode
// @access  Private
export const joinGame = async(req, res) => {
    try {
        const game = await Game.findOne({ gameCode: req.params.gameCode });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (game.status !== 'waiting') {
            return res.status(400).json({
                success: false,
                message: 'Game is already in progress or completed'
            });
        }

        if (game.player1.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot join your own game'
            });
        }

        // Update the game with the second player and change status to playing
        game.player2 = req.user.id;
        game.status = 'playing';
        game.lastActivityAt = Date.now();

        await game.save();

        await game.populate('player1 player2', 'username');

        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all public games
// @route   GET /api/games/public
// @access  Private
export const getPublicGames = async(req, res) => {
    try {
        const games = await Game.find({
            isPublic: true,
            status: 'waiting'
        }).populate('player1', 'username');

        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's games
// @route   GET /api/games/my-games
// @access  Private
export const getMyGames = async(req, res) => {
    try {
        const games = await Game.find({
            $or: [
                { player1: req.user.id },
                { player2: req.user.id }
            ],
            status: { $ne: 'abandoned' }
        }).populate('player1 player2', 'username');

        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get game by ID
// @route   GET /api/games/:id
// @access  Private
export const getGameById = async(req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('player1 player2', 'username');

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Make a move in a game
// @route   PUT /api/games/:id/move
// @access  Private
export const makeMove = async(req, res) => {
    try {
        const { fromRow, fromCol, toRow, toCol } = req.body;

        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        // Check if the game is active
        if (game.status !== 'playing') {
            return res.status(400).json({
                success: false,
                message: 'This game is not in playing state'
            });
        }

        // Check if it's the user's turn
        const isPlayer1 = game.player1.toString() === req.user.id;
        const isPlayer2 = game.player2.toString() === req.user.id;

        if (!isPlayer1 && !isPlayer2) {
            return res.status(403).json({
                success: false,
                message: 'You are not a player in this game'
            });
        }

        const playerColor = isPlayer1 ? 'black' : 'red';

        if (game.currentPlayer !== playerColor) {
            return res.status(400).json({
                success: false,
                message: 'It is not your turn to move'
            });
        }

        // Validate move (basic validation - a full implementation would check if move is legal)
        if (!isValidMove(game, fromRow, fromCol, toRow, toCol)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid move'
            });
        }

        // Apply the move to the board
        applyMove(game, fromRow, fromCol, toRow, toCol);

        // Switch current player
        game.currentPlayer = game.currentPlayer === 'black' ? 'red' : 'black';

        // Record last move
        game.lastMove = { fromRow, fromCol, toRow, toCol };

        // Update last activity time
        game.lastActivityAt = Date.now();

        // Check if this move wins the game
        const gameStatus = checkGameStatus(game);
        if (gameStatus !== 'playing') {
            game.status = gameStatus;

            // Update winner and user stats
            if (gameStatus === 'blackWin' || gameStatus === 'redWin') {
                // Update winner info
                const winnerId = gameStatus === 'blackWin' ? game.player1 : game.player2;
                const loserId = gameStatus === 'blackWin' ? game.player2 : game.player1;

                game.winner = winnerId;

                // Update player stats
                await updatePlayerStats(winnerId, loserId);
            }
        }

        await game.save();

        await game.populate('player1 player2', 'username');

        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Forfeit a game
// @route   PUT /api/games/:id/forfeit
// @access  Private
export const forfeitGame = async(req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        // Check if the user is a player in this game
        const isPlayer1 = game.player1.toString() === req.user.id;
        const isPlayer2 = game.player2.toString() === req.user.id;

        if (!isPlayer1 && !isPlayer2) {
            return res.status(403).json({
                success: false,
                message: 'You are not a player in this game'
            });
        }

        // Check if the game is still active
        if (game.status !== 'playing') {
            return res.status(400).json({
                success: false,
                message: 'This game is not in playing state'
            });
        }

        // Update game status based on who forfeited
        if (isPlayer1) {
            game.status = 'redWin';
            game.winner = game.player2;
        } else {
            game.status = 'blackWin';
            game.winner = game.player1;
        }

        // Update player stats
        await updatePlayerStats(
            game.winner,
            isPlayer1 ? game.player1 : game.player2
        );

        await game.save();

        await game.populate('player1 player2', 'username');

        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a game
// @route   DELETE /api/games/:id
// @access  Private
export const deleteGame = async(req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        // Check if the user is the creator of the game
        if (game.player1.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Only the creator of the game can delete it'
            });
        }

        // Only waiting games can be deleted
        if (game.status !== 'waiting') {
            return res.status(400).json({
                success: false,
                message: 'Only games that are waiting for players can be deleted'
            });
        }

        await game.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Game deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper Functions

// Validate if a move is legal (simplified version)
const isValidMove = (game, fromRow, fromCol, toRow, toCol) => {
    // In a real implementation, this would contain complete checkers rules
    // Here's a simplified validation for demonstration

    // Check boundary
    if (
        fromRow < 0 || fromRow > 7 ||
        fromCol < 0 || fromCol > 7 ||
        toRow < 0 || toRow > 7 ||
        toCol < 0 || toCol > 7
    ) {
        return false;
    }

    // Check if there's a piece at from position and it's the current player's
    if (game.board[fromRow][fromCol] !== game.currentPlayer) {
        return false;
    }

    // Check if destination is empty
    if (game.board[toRow][toCol] !== '') {
        return false;
    }

    // Check if the move is diagonal
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
        return false;
    }

    // Simple diagonal move (1 square)
    if (Math.abs(toRow - fromRow) === 1) {
        // Regular pieces can only move forward unless they are kings
        const isKing = game.kings.get(`${fromRow}-${fromCol}`);

        if (!isKing) {
            if (game.currentPlayer === 'black' && toRow < fromRow) {
                return false;
            }
            if (game.currentPlayer === 'red' && toRow > fromRow) {
                return false;
            }
        }

        return true;
    }

    // Jump move (2 squares)
    if (Math.abs(toRow - fromRow) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        const opponent = game.currentPlayer === 'black' ? 'red' : 'black';

        // Check if jumping over opponent's piece
        if (game.board[midRow][midCol] !== opponent) {
            return false;
        }

        // Regular pieces can only move forward unless they are kings
        const isKing = game.kings.get(`${fromRow}-${fromCol}`);

        if (!isKing) {
            if (game.currentPlayer === 'black' && toRow < fromRow) {
                return false;
            }
            if (game.currentPlayer === 'red' && toRow > fromRow) {
                return false;
            }
        }

        return true;
    }

    return false;
};

// Apply a move to the game board
const applyMove = (game, fromRow, fromCol, toRow, toCol) => {
    // Move the piece
    game.board[toRow][toCol] = game.board[fromRow][fromCol];
    game.board[fromRow][fromCol] = '';

    // Check if it was a jump move and capture opponent's piece
    if (Math.abs(toRow - fromRow) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;

        // Capture piece
        const capturedPieceColor = game.board[midRow][midCol];
        game.board[midRow][midCol] = '';

        // Update capture count
        if (capturedPieceColor === 'black') {
            game.capturedPieces.black += 1;
        } else {
            game.capturedPieces.red += 1;
        }
    }

    // Check if piece should be kinged
    const isKing = game.kings.get(`${fromRow}-${fromCol}`);

    if (isKing) {
        // Transfer king status to new position
        game.kings.delete(`${fromRow}-${fromCol}`);
        game.kings.set(`${toRow}-${toCol}`, true);
    } else {
        // Check if piece reaches the opposite end
        if (
            (game.board[toRow][toCol] === 'black' && toRow === 7) ||
            (game.board[toRow][toCol] === 'red' && toRow === 0)
        ) {
            // King the piece
            game.kings.set(`${toRow}-${toCol}`, true);
        }
    }
};

// Check if the game has ended
const checkGameStatus = (game) => {
    // Count pieces
    let blackPieces = 0;
    let redPieces = 0;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (game.board[row][col] === 'black') {
                blackPieces++;
            } else if (game.board[row][col] === 'red') {
                redPieces++;
            }
        }
    }

    // If a player has no pieces left, the other player wins
    if (blackPieces === 0) {
        return 'redWin';
    } else if (redPieces === 0) {
        return 'blackWin';
    }

    // Check for valid moves (simplified)
    // In a real implementation, we'd check if the current player has any valid moves

    return 'playing';
};

// Update player stats after a game is completed
const updatePlayerStats = async(winnerId, loserId) => {
    // Update winner stats
    const winner = await User.findById(winnerId);
    if (winner) {
        winner.stats.gamesPlayed += 1;
        winner.stats.gamesWon += 1;
        await winner.save({ validateBeforeSave: false });
    }

    // Update loser stats
    const loser = await User.findById(loserId);
    if (loser) {
        loser.stats.gamesPlayed += 1;
        loser.stats.gamesLost += 1;
        await loser.save({ validateBeforeSave: false });
    }
};