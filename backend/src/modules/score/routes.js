const express = require('express');
const scoreController = require('./controller');
const authMiddleware = require('../../../middlewares/auth.middleware');
const subscriptionMiddleware = require('../../../middlewares/subscription.middleware');

const router = express.Router();

// All score routes require auth AND an active subscription
router.use(authMiddleware);
router.use(subscriptionMiddleware);

router.post('/', scoreController.submitScore);
router.get('/', scoreController.getScores);

module.exports = router;
