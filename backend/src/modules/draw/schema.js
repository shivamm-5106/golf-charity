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

DrawSchema.index({ month: 1 }, { unique: true });
DrawSchema.index({ status: 1 });

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
    proofUrl: {
        type: String // To store S3 link / mocked proof
    },
    verificationNotes: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

WinnerSchema.index({ userId: 1, drawId: 1 }, { unique: true });
WinnerSchema.index({ drawId: 1 });
WinnerSchema.index({ status: 1 });

module.exports = {
    Draw: mongoose.model('Draw', DrawSchema),
    Winner: mongoose.model('Winner', WinnerSchema)
};
