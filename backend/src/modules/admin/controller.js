const adminService = require('./service');

class AdminController {
    async getDashboard(req, res) {
        try {
            const data = await adminService.getDashboardStats();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async verifyWinner(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;
            
            const updated = await adminService.verifyWinner(id, status, notes);
            res.json({ success: true, message: `Winner ${status}`, data: updated });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AdminController();
