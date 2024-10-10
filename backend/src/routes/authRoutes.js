const express = require('express');
const { registerUser, loginUser, getAdminAccess } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

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
 *                 example: mikkel
 *               password:
 *                 type: string
 *                 description: The password of the user, must be at least 6 characters long and contain at least one letter and one number
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [soldier, officer, admin]
 *                 description: The role of the user
 *                 example: soldier
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
 *                 example: Mikkel
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
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
 *                   description: The JWT token for authentication.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           description: Bearer token for authorization
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Admin access granted.
 *       401:
 *         description: Unauthorized. No token provided or token is invalid.
 *       403:
 *         description: Forbidden. User does not have admin rights.
 */
router.get('/admin', authMiddleware, roleMiddleware('admin'), getAdminAccess);

module.exports = router;
