// const express = require('express');
// const { register, login, verifyEmail, forgotPassword, resetPassword, getCurrentUser } = require('../controllers/authController');
// const auth = require('../middleware/auth');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/verify/:token', verifyEmail);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
// router.get('/me', auth, getCurrentUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', authController.registerUser);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', authController.loginUser);

// @route    GET api/auth/me
// @desc     Get authenticated user
// @access   Private
router.get('/me', auth, authController.getAuthUser);

// @route    GET api/auth/verify/:token
// @desc     Verify email
// @access   Public
router.get('/verify/:token', authController.verifyEmail);

module.exports = router;
