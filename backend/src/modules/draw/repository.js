const { Draw, Winner } = require('./schema');

class DrawRepository {
    async createDraw(month, prizePool) {
        return await new Draw({ month, totalPrizePool: prizePool }).save();
    }

    async getDrawByMonth(month) {
        return await Draw.findOne({ month });
    }

    async updateDraw(drawId, updateData) {
        return await Draw.findByIdAndUpdate(drawId, updateData, { new: true });
    }

    async createWinner(data) {
        return await new Winner(data).save();
    }

    async getWinnersByDraw(drawId) {
        return await Winner.find({ drawId }).populate('userId', 'name');
    }
}

module.exports = new DrawRepository();
