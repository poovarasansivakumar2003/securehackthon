const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).redirect('/auth/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(403).redirect('/auth/login');
    }
};

const redirectIfAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/');
        } catch (err) {
            console.error('Invalid or expired token:', err);
        }
    }
    next();
};

module.exports = { requireAuth, redirectIfAuthenticated };
