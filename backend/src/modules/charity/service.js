const repo = require('./repository');
const User = require('../auth/schema');

class CharityService {
    async getCharities() {
        return await repo.getAllCharities();
    }

    async selectCharity(userId, charityId) {
        const charity = await repo.findCharityById(charityId);
        if (!charity) {
            throw new Error('Charity not found');
        }

        // Update user's selected charity
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { selectedCharity: charityId },
            { new: true }
        ).populate('selectedCharity', 'name');

        if (!updatedUser) {
            throw new Error('User not found');
        }

        // Return the charity object directly (populate may return null if ref is missing)
        return updatedUser.selectedCharity || charity;
    }
}

module.exports = new CharityService();
