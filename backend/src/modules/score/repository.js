const Score = require('./schema');

class ScoreRepository {
    async addScore(userId, value, datePlayed) {
        return await new Score({ userId, value, datePlayed }).save();
    }

    async getUserScores(userId) {
        // Return latest scores first
        return await Score.find({ userId }).sort({ datePlayed: -1 }).limit(5);
    }

    async countUserScores(userId) {
        return await Score.countDocuments({ userId });
    }

    async deleteOldestUserScore(userId) {
        // Find the oldest and delete it
        const oldest = await Score.findOne({ userId }).sort({ datePlayed: 1 });
        if (oldest) {
            await Score.findByIdAndDelete(oldest._id);
        }
    }
}

module.exports = new ScoreRepository();
