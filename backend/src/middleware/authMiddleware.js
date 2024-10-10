const { verifyJWT } = require('../utils/jwtUtils');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = verifyJWT(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Middleware to verify role
const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied. Insufficient role' });
    }
    next();
};

// Export both middlewares
module.exports = {
    authMiddleware,
    roleMiddleware,
};
