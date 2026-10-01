// Authentication logic for MedCare.
// This file creates users, verifies passwords, and issues JWT tokens for logged-in patients.
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { createToken } = require('../config/auth');

/** Shape account rows for API responses without exposing password hashes. */
function publicUser(row) {
    return { id: row.id, name: row.name, email: row.email, role: row.role };
}

/** POST /auth/register: create an account and return its public profile with a session token. */
async function register(req, res) {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 120) {
        return res.status(400).json({ error: 'Enter your name (2 to 120 characters).' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Use a password with at least 8 characters.' });
    }

    try {
        // Persist only a bcrypt hash; plaintext passwords are never stored or returned.
        const passwordHash = await bcrypt.hash(password, 12);
        const result = await pool.query(
            'INSERT INTO app_users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, passwordHash],
        );
        const user = publicUser(result.rows[0]);
        return res.status(201).json({ token: createToken(user.id), user });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Could not create your account.' });
    }
}

/** POST /auth/login: authenticate credentials without revealing whether an email exists. */
async function login(req, res) {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
        return res.status(400).json({ error: 'Enter your email and password.' });
    }

    try {
        const result = await pool.query(
            'SELECT id, name, email, role, password_hash FROM app_users WHERE email = $1',
            [email],
        );
        const row = result.rows[0];
        if (!row || !(await bcrypt.compare(password, row.password_hash))) {
            return res.status(401).json({ error: 'Email or password is incorrect.' });
        }
        const user = publicUser(row);
        return res.json({ token: createToken(user.id), user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not sign in right now.' });
    }
}

/** GET /auth/me: return the account associated with the verified bearer token. */
async function me(req, res) {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role FROM app_users WHERE id = $1',
            [req.userId],
        );
        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Account not found.' });
        }
        return res.json(publicUser(result.rows[0]));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not load your account.' });
    }
}

module.exports = { register, login, me };