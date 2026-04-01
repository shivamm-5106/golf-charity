const repo = require('./repository');

class AdminService {
    async getDashboardStats() {
        const stats = await repo.getPlatformStats();
        const pendingWinners = await repo.getPendingWinners();
        
        return {
            overview: stats,
            pendingApprovals: pendingWinners
        };
    }

    async verifyWinner(winnerId, status, notes) {
        if (!['approved', 'rejected', 'paid'].includes(status)) {
            throw new Error('Invalid verification status');
        }

        const winner = await repo.updateWinnerStatus(winnerId, status, notes);
        if (!winner) throw new Error('Winner record not found');
        return winner;
    }
}

module.exports = new AdminService();
