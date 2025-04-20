import express from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import config from './config/default.js';

// Route files
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import { setMongoStatus } from './middleware/auth.js';

// Global variable to track MongoDB connection status
let isMongoConnected = false;

// Try to connect to database but continue if it fails
try {
    await connectDB();
    isMongoConnected = true;
    // Update the auth middleware with connection status
    setMongoStatus(true);
    console.log('MongoDB connected successfully');
} catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Server will continue in development mode with limited functionality');
    // Ensure auth middleware knows MongoDB is not connected
    setMongoStatus(false);
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Add middleware to intercept auth requests when MongoDB is down
app.use('/api/auth', (req, res, next) => {
    // For login and register routes, provide demo users when MongoDB is down
    if (!isMongoConnected && (req.path === '/login' || req.path === '/register')) {
        console.log(`MongoDB not connected - handling ${req.path} in demo mode`);

        if (req.path === '/login') {
            return res.status(200).json({
                success: true,
                token: 'demo-token-123456789',
                user: {
                    username: req.body.username || 'DemoUser',
                    email: 'demo@example.com',
                    _id: 'demo123456789'
                }
            });
        } else if (req.path === '/register') {
            return res.status(201).json({
                success: true,
                token: 'demo-token-123456789',
                user: {
                    username: req.body.username,
                    email: req.body.email,
                    _id: 'demo-' + Date.now()
                }
            });
        }
    }
    next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Add a health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        mongoConnected: isMongoConnected,
        message: 'Server is healthy' + (isMongoConnected ? ' with MongoDB' : ' without MongoDB')
    });
});

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a game room
    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`User ${socket.id} joined game: ${gameId}`);
    });

    // Leave a game room
    socket.on('leaveGame', (gameId) => {
        socket.leave(gameId);
        console.log(`User ${socket.id} left game: ${gameId}`);
    });

    // Handle a move being made
    socket.on('makeMove', (data) => {
        // Broadcast the move to everyone in the game room except the sender
        socket.to(data.gameId).emit('moveMade', data);
    });

    // Handle game updates (forfeit, etc.)
    socket.on('gameUpdate', (data) => {
        socket.to(data.gameId).emit('gameUpdated', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Handle unhandled promise rejections more gracefully
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Log the error but don't exit the process in development
    if (config.NODE_ENV === 'production') {
        // Close server & exit process only in production
        server.close(() => process.exit(1));
    }
});

const PORT = process.env.PORT || config.PORT;

server.listen(PORT, () => {
    console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
    console.log(`MongoDB Status: ${isMongoConnected ? 'Connected' : 'Not Connected - Running in Demo Mode'}`);
});

// Export the connection status for other modules
export { isMongoConnected };