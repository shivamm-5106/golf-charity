const subRepo = require('../src/modules/subscription/repository');

module.exports = async function (req, res, next) {
    try {
        const sub = await subRepo.findSubscriptionByUserId(req.user.id);
        
        if (!sub || sub.status !== 'active') {
            return res.status(403).json({ 
                success: false, 
                message: 'Active subscription required to access this feature',
                code: 'SUBSCRIPTION_REQUIRED'
            });
        }
        
        req.subscription = sub;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error checking subscription' });
    }
};
