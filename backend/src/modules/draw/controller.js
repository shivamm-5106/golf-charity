const drawService = require('./service');

class DrawController {
    async triggerDraw(req, res) {
        try {
            const result = await drawService.executeMonthlyDraw();
            res.status(200).json({ success: true, message: 'Draw Executed!', data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getResults(req, res) {
        try {
            const result = await drawService.getLatestDrawResults();
            if (!result) return res.status(404).json({ success: false, message: 'No draw results yet' });
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new DrawController();
