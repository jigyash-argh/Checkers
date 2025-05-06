import express from 'express';
import {
    createGame,
    joinGame,
    getPublicGames,
    getMyGames,
    getGameById,
    makeMove,
    forfeitGame,
    deleteGame
} from '../controllers/game.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All game routes require authentication
router.use(protect);

// Game routes
router.post('/', createGame);
router.get('/public', getPublicGames);
router.get('/my-games', getMyGames);
router.get('/:id', getGameById);
router.put('/join/:gameCode', joinGame);
router.put('/:id/move', makeMove);
router.put('/:id/forfeit', forfeitGame);
router.delete('/:id', deleteGame);

export default router;