const repo = require('./repository');

class SubscriptionService {
    async getStatus(userId) {
        let sub = await repo.findSubscriptionByUserId(userId);
        if (!sub) {
            return { status: 'none', plan: null };
        }
        return { status: sub.status, plan: sub.plan };
    }

    async createMockCheckoutSession(userId, plan) {
        // MOCK: In a real app, we'd call Stripe here.
        // For now, we simulate a successful checkout and return a fake URL.
        const mockUrl = `/dashboard?mock_success=true&plan=${plan}`;
        return { url: mockUrl };
    }

    async handleMockSuccess(userId, plan) {
        let sub = await repo.findSubscriptionByUserId(userId);
        
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (!sub) {
            sub = await repo.createSubscription({
                userId,
                plan,
                status: 'active',
                renewalDate: nextMonth,
                stripeCustomerId: 'cus_mock123',
                stripeSubscriptionId: 'sub_mock123'
            });
        } else {
            sub.status = 'active';
            sub.plan = plan;
            sub.renewalDate = nextMonth;
            await sub.save();
        }

        return sub;
    }
}

module.exports = new SubscriptionService();
