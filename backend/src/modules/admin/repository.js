const User = require('../auth/schema');
const { Winner, Draw } = require('../draw/schema');
const Charity = require('../charity/schema');

class AdminRepository {
    async getPlatformStats() {
        // High level overview
        const userCount = await User.countDocuments();
        const drawCount = await Draw.countDocuments();
        const charityCount = await Charity.countDocuments();
        
        return { users: userCount, draws: drawCount, charities: charityCount };
    }

    async getPendingWinners() {
        return await Winner.find({ status: 'pending' })
            .populate('userId', 'name email')
            .populate('drawId', 'month totalPrizePool');
    }

    async updateWinnerStatus(winnerId, status, notes) {
        return await Winner.findByIdAndUpdate(
            winnerId, 
            { status, verificationNotes: notes },
            { new: true }
        );
    }
}

module.exports = new AdminRepository();
