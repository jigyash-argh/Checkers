import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentPlayer: {
        type: String,
        enum: ['black', 'red'],
        default: 'black'
    },
    board: {
        type: [
            [String]
        ],
        required: true,
        default: [
            ['', 'black', '', 'black', '', 'black', '', 'black'],
            ['black', '', 'black', '', 'black', '', 'black', ''],
            ['', 'black', '', 'black', '', 'black', '', 'black'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['red', '', 'red', '', 'red', '', 'red', ''],
            ['', 'red', '', 'red', '', 'red', '', 'red'],
            ['red', '', 'red', '', 'red', '', 'red', '']
        ]
    },
    kings: {
        type: Map,
        of: Boolean,
        default: new Map()
    },
    status: {
        type: String,
        enum: ['waiting', 'playing', 'blackWin', 'redWin', 'draw', 'abandoned'],
        default: 'waiting'
    },
    lastMove: {
        fromRow: Number,
        fromCol: Number,
        toRow: Number,
        toCol: Number
    },
    capturedPieces: {
        black: {
            type: Number,
            default: 0
        },
        red: {
            type: Number,
            default: 0
        }
    },
    gameCode: {
        type: String,
        unique: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActivityAt: {
        type: Date,
        default: Date.now
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Generate random game code before saving
GameSchema.pre('save', function(next) {
    if (!this.gameCode) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        this.gameCode = result;
    }
    next();
});

export default mongoose.model('Game', GameSchema);