const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register User
const registerUser = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required().messages({
            'string.base': 'Username must be a text value.',
            'string.min': 'Username must be at least 3 characters.',
            'any.required': 'Username is required.',
        }),
        password: Joi.string().min(6).required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).messages({
            'string.base': 'Password must be a text value.',
            'string.min': 'Password must be at least 6 characters.',
            'any.required': 'Password is required.',
            'string.pattern.base': 'Password must contain at least one letter and one number.',
        }),
        role: Joi.string().valid('soldier', 'officer', 'admin'),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password, role } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, password: await bcrypt.hash(password, 10), role });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in a HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin Access
const getAdminAccess = (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
};

module.exports = {
    registerUser,
    loginUser,
    getAdminAccess,
};
