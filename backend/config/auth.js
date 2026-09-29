const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET ||
    (process.env.NODE_ENV === 'production' ? null : 'medcare-local-development-secret-change-before-deploying');

if (!secret) {
    throw new Error('JWT_SECRET must be set in production.');
}

function createToken(userId) {
    return jwt.sign({ sub: String(userId) }, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { createToken, verifyToken };