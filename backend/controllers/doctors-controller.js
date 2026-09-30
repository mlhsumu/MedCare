// Doctor listing logic for MedCare.
// This endpoint supports search and specialization filters so patients can browse doctors quickly.
const pool = require('../db');

async function listDoctors(req, res) {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const specialization = typeof req.query.specialization === 'string'
        ? req.query.specialization.trim()
        : '';
    const values = [];
    const conditions = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(name ILIKE $${values.length} OR specialization ILIKE $${values.length})`);
    }
    if (specialization) {
        values.push(specialization);
        conditions.push(`specialization ILIKE $${values.length}`);
    }

    try {
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await pool.query(`SELECT * FROM doctors ${where} ORDER BY id`, values);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not load doctors.' });
    }
}

async function getDoctor(req, res) {
    const doctorId = Number(req.params.id);
    if (!Number.isInteger(doctorId) || doctorId < 1) {
        return res.status(400).json({ error: 'Invalid doctor.' });
    }

    try {
        const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [doctorId]);
        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not load this doctor.' });
    }
}

module.exports = { listDoctors, getDoctor };