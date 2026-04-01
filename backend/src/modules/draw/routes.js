const express = require('express');
const drawController = require('./controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

const router = express.Router();

router.get('/results', drawController.getResults);

// Trigger Draw manually (usually Admin or cron, but exposed here for testing)
router.post('/trigger', authMiddleware, drawController.triggerDraw);

module.exports = router;
