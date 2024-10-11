const express = require('express');
const { registerUser, loginUser, getAdminAccess } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Server error while fetching users.
 */
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [soldier, officer, admin]
 *                 example: soldier
 *     responses:
 *       201:
 *         description: User added successfully.
 *       400:
 *         description: User already exists.
 *       500:
 *         description: Server error while adding user.
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error while deleting user.
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updateduser
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 enum: [soldier, officer, admin]
 *                 example: officer
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error while updating user.
 */
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
