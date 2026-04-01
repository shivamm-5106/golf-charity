const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
    month: {
        type: String, // e.g., '2026-04'
        required: true,
        unique: true
    },
    drawnNumbers: [{
        type: Number
    }],
    totalPrizePool: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

const WinnerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    drawId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Draw',
        required: true
    },
    matchCount: {
        type: Number,
        required: true
    },
    prizeAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = {
    Draw: mongoose.model('Draw', DrawSchema),
    Winner: mongoose.model('Winner', WinnerSchema)
};
