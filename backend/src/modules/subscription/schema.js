const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true,
        default: 'monthly'
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete'],
        default: 'inactive'
    },
    stripeCustomerId: {
        type: String
    },
    stripeSubscriptionId: {
        type: String
    },
    renewalDate: {
        type: Date
    }
}, { timestamps: true });

SubscriptionSchema.index({ userId: 1 }, { unique: true });
SubscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
