// Auth routes handle sign-up, sign-in, and fetching the current user.
// These endpoints are used by the mobile app to manage the session.
const express = require('express');
const requireAuth = require('../middleware/require-auth');
const { register, login, me } = require('../controllers/auth-controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);

module.exports = router;