const Charity = require('./schema');

class CharityRepository {
    async getAllCharities() {
        return await Charity.find();
    }

    async findCharityById(id) {
        return await Charity.findById(id);
    }
}

module.exports = new CharityRepository();
