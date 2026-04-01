const User = require('./schema');

class AuthRepository {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    async findUserById(id) {
        return await User.findById(id).select('-password');
    }
}

module.exports = new AuthRepository();
