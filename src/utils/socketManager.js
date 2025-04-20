import { io } from 'socket.io-client';

class SocketManager {
    constructor() {
        this.socket = null;
        this.gameListeners = new Map();
    }

    // Connect to the Socket.IO server
    connect() {
        if (this.socket) return;

        this.socket = io('http://localhost:5000', {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    // Disconnect from the Socket.IO server
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.gameListeners.clear();
        }
    }

    // Join a game room
    joinGame(gameId) {
        if (!this.socket) this.connect();

        this.socket.emit('joinGame', gameId);
        console.log(`Joined game room: ${gameId}`);
    }

    // Leave a game room
    leaveGame(gameId) {
        if (!this.socket) return;

        this.socket.emit('leaveGame', gameId);
        console.log(`Left game room: ${gameId}`);
    }

    // Send a move to the server
    sendMove(gameId, moveData) {
        if (!this.socket) return;

        this.socket.emit('makeMove', {
            gameId,
            ...moveData
        });
    }

    // Send a game update (forfeit, etc.)
    sendGameUpdate(gameId, updateType, data = {}) {
        if (!this.socket) return;

        this.socket.emit('gameUpdate', {
            gameId,
            updateType,
            ...data
        });
    }

    // Listen for moves from the opponent
    onMoveMade(callback) {
        if (!this.socket) this.connect();

        this.socket.on('moveMade', (data) => {
            callback(data);
        });
    }

    // Listen for game updates
    onGameUpdated(callback) {
        if (!this.socket) this.connect();

        this.socket.on('gameUpdated', (data) => {
            callback(data);
        });
    }

    // Remove all socket listeners
    removeAllListeners() {
        if (!this.socket) return;

        this.socket.off('moveMade');
        this.socket.off('gameUpdated');
    }
}

// Create a singleton instance
const socketManager = new SocketManager();

export default socketManager;