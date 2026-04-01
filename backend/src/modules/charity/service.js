const repo = require('./repository');
const userRepo = require('../auth/repository');
const User = require('../auth/schema'); // For updating user

class CharityService {
    async getCharities() {
        return await repo.getAllCharities();
    }

    async selectCharity(userId, charityId) {
        const charity = await repo.findCharityById(charityId);
        if (!charity) {
            throw new Error('Charity not found');
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { selectedCharity: charityId },
            { new: true }
        ).populate('selectedCharity', 'name');

        return updatedUser.selectedCharity;
    }
}

module.exports = new CharityService();
