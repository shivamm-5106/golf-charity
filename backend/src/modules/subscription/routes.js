const express = require('express');
const subController = require('./controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/status', subController.getStatus);
router.post('/checkout', subController.checkout);

// MOCK: Webhook simulation
router.post('/mock-success', subController.handleMockSuccess);

module.exports = router;
