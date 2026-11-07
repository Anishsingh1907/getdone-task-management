const express = require('express');
const router = express.Router();
const { login, getAllUsers, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.get('/users', authenticate, getAllUsers);
router.get('/me', authenticate, getMe);

module.exports = router;

