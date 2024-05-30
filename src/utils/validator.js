const { check } = require('express-validator');

exports.registerValidation = [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('email').isEmail().withMessage('Email is invalid'),
];

exports.loginValidation = [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.itemValidation = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('starting_price').isDecimal().withMessage('Starting price must be a decimal'),
    check('end_time').not().isEmpty().withMessage('End time is required'),
];
