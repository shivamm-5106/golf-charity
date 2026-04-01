const charityService = require('./service');

class CharityController {
    async getCharities(req, res) {
        try {
            const charities = await charityService.getCharities();
            res.json({ success: true, data: charities });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async selectCharity(req, res) {
        try {
            const { charityId } = req.body;
            if (!charityId) {
                return res.status(400).json({ success: false, message: 'Charity ID required' });
            }

            const updatedSelection = await charityService.selectCharity(req.user.id, charityId);
            res.json({ success: true, message: 'Charity selected successfully', data: updatedSelection });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new CharityController();
