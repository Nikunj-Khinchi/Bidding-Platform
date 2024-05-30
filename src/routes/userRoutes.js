const express = require('express');
const { check } = require('express-validator');
const { register, login, getProfile, resetPassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
    check('username').not().isEmpty(),
    check('password').isLength({ min: 6 }),
    check('email').isEmail(),
], register);

router.post('/login', [
    check('email').not().isEmpty().isEmail(),
    check('password').isLength({ min: 6 }),
], login);

router.post('/reset-password', [
    check('email').not().isEmpty().isEmail(),
    check('oldPassword').isLength({ min: 6 }),
    check('newPassword').isLength({ min: 6 }),
] , resetPassword)

router.get('/profile', authMiddleware, getProfile);

module.exports = router;
