const Subscription = require('./schema');

class SubscriptionRepository {
    async createSubscription(data) {
        return await new Subscription(data).save();
    }

    async findSubscriptionByUserId(userId) {
        return await Subscription.findOne({ userId });
    }

    async updateSubscriptionStatus(userId, status) {
        return await Subscription.findOneAndUpdate(
            { userId }, 
            { status }, 
            { new: true }
        );
    }
}

module.exports = new SubscriptionRepository();
