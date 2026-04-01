const express = require('express');
const adminController = require('./controller');
const authMiddleware = require('../../../middlewares/auth.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', adminController.getDashboard);
router.post('/verify/winner/:id', adminController.verifyWinner);

module.exports = router;
