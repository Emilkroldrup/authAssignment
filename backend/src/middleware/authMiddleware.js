const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
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
