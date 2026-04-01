const scoreService = require('./service');

class ScoreController {
    async submitScore(req, res) {
        try {
            const { value, datePlayed } = req.body;
            
            if (!value) {
                return res.status(400).json({ success: false, message: 'Score value is required' });
            }

            const newScore = await scoreService.submitScore(req.user.id, value, datePlayed);
            res.status(201).json({ success: true, message: 'Score submitted', data: newScore });

        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getScores(req, res) {
        try {
            const scores = await scoreService.getUserScores(req.user.id);
            res.status(200).json({ success: true, data: scores });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ScoreController();
