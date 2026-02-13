const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/login', authController.login);

// Register route
router.post('/register', authController.register);

module.exports = router;