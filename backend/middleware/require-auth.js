// Middleware that protects routes that require a logged-in patient.
// It reads the bearer token, verifies it, and attaches the authenticated user id to the request.
const { verifyToken } = require('../config/auth');

function requireAuth(req, res, next) {
    const authorization = req.get('authorization') || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Please sign in to continue.' });
    }

    try {
        const payload = verifyToken(token);
        req.userId = Number(payload.sub);
        if (!Number.isInteger(req.userId)) {
            throw new Error('Invalid user id');
        }
        return next();
    } catch {
        return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
    }
}

module.exports = requireAuth;