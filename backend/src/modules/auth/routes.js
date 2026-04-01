const express = require('express');
const authController = require('./controller');

const router = express.Router();

// Route: Auth
router.post('/signup', authController.register);
router.post('/login', authController.login);

module.exports = router;
