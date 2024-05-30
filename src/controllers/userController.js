const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const { registerValidation, loginValidation } = require('../utils/validator');
const dotenv = require('dotenv');
const { use } = require('../app');

dotenv.config();

exports.register = async (req, res) => {
    const errors = validationResult(req);
    const { username, password, email , role } = req.body;
 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    

    const user = await User.findOne({ where: { email , username } });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    try {
        // const hashedPassword = await bcrypt.hash(password, 12);
        const users = await User.create({ username, password, email , role });
        res.status(201).json({ message: 'User registered successfully', users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (oldPassword != user.password) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        // const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};