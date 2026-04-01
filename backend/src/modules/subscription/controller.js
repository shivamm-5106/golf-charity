const subService = require('./service');

class SubscriptionController {
    async getStatus(req, res) {
        try {
            const status = await subService.getStatus(req.user.id);
            res.json({ success: true, data: status });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async checkout(req, res) {
        try {
            const { plan } = req.body;
            if (!['monthly', 'yearly'].includes(plan)) {
                return res.status(400).json({ success: false, message: 'Invalid plan selected' });
            }

            const response = await subService.createMockCheckoutSession(req.user.id, plan);
            res.json({ success: true, data: response });
        } catch (error) {
             res.status(500).json({ success: false, message: error.message });
        }
    }

    async handleMockSuccess(req, res) {
        try {
            const { plan } = req.body;
            const updatedSub = await subService.handleMockSuccess(req.user.id, plan);
            res.json({ success: true, message: 'Subscription successfully mocked', data: updatedSub });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new SubscriptionController();
