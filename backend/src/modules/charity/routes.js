const express = require('express');
const charityController = require('./controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', charityController.getCharities);

router.use(authMiddleware);
router.post('/select', charityController.selectCharity);

module.exports = router;
