const pool = require('../db');

async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS app_users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            patient_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
            doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_unique
        ON appointments (doctor_id, appointment_date, appointment_time)
        WHERE status = 'confirmed'
    `);
}

module.exports = initializeDatabase;