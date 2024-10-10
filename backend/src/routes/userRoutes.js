const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Get all users
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});

// Add a new user
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            role,
        });

        await user.save();
        res.status(201).json({ message: 'User added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding user' });
    }
});

// Delete a user
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting user' });
    }
});

// Update a user
router.put('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.role = role || user.role;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating user' });
    }
});

module.exports = router;
