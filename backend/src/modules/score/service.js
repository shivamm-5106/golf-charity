const repo = require('./repository');

class ScoreService {
    async submitScore(userId, value, datePlayed) {
        if (value < 1 || value > 45) {
            throw new Error('Score must be between 1 and 45');
        }

        // Logic: Max 5 scores
        const currentCount = await repo.countUserScores(userId);
        
        if (currentCount >= 5) {
            // Delete the oldest score
            await repo.deleteOldestUserScore(userId);
        }

        // Add the new score
        const newScore = await repo.addScore(userId, value, datePlayed);
        return newScore;
    }

    async getUserScores(userId) {
        return await repo.getUserScores(userId);
    }
}

module.exports = new ScoreService();
