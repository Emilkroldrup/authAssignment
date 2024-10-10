const express = require('express');
const { registerUser, loginUser, getAdminAccess } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware'); // Correctly import roleMiddleware

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user, must be at least 6 characters long and contain at least one letter and one number
 *                 example: Pa$$w0rd
 *               role:
 *                 type: string
 *                 enum: [soldier, officer, admin]
 *                 description: The role of the user
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Pa$$w0rd
 *     responses:
 *       200:
 *         description: User logged in successfully, returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Admin only route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted.
 *       403:
 *         description: Forbidden.
 */
router.get('/admin', authMiddleware, roleMiddleware('admin'), getAdminAccess);

module.exports = router;
