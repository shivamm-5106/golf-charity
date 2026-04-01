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

// Ensure we don't have too many scores logic happens in service,
// but we index userId for fast fetching of all a user's scores
module.exports = mongoose.model('Score', ScoreSchema);
