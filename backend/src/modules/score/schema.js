const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 45
    },
    datePlayed: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

ScoreSchema.index({ userId: 1, datePlayed: -1 }); // Fast FIFO + user score fetching

module.exports = mongoose.model('Score', ScoreSchema);
