const pool = require('../db');

async function listAppointments(req, res) {
    try {
        const result = await pool.query(
            `SELECT a.id,
                    to_char(a.appointment_date, 'YYYY-MM-DD') AS appointment_date,
                    to_char(a.appointment_time, 'HH24:MI') AS appointment_time,
                    a.status,
                    d.id AS doctor_id,
                    d.name AS doctor_name,
                    d.specialization,
                    d.fee
             FROM appointments a
             JOIN doctors d ON d.id = a.doctor_id
             WHERE a.patient_id = $1
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
            [req.userId],
        );
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not load appointments.' });
    }
}

async function bookAppointment(req, res) {
    const doctorId = Number(req.body.doctorId);
    const date = typeof req.body.date === 'string' ? req.body.date : '';
    const time = typeof req.body.time === 'string' ? req.body.time : '';

    if (!Number.isInteger(doctorId) || doctorId < 1 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
        return res.status(400).json({ error: 'Choose a valid doctor, date, and time.' });
    }

    try {
        const doctorResult = await pool.query(
            `SELECT id, available_from::text AS available_from, available_to::text AS available_to
             FROM doctors WHERE id = $1`,
            [doctorId],
        );
        const doctor = doctorResult.rows[0];
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }

        if (time < doctor.available_from.slice(0, 5) || time >= doctor.available_to.slice(0, 5)) {
            return res.status(400).json({ error: 'Choose a time during this doctor’s availability.' });
        }

        const dateCheck = await pool.query(
            `SELECT $1::date >= CURRENT_DATE AS is_valid,
                    ($1::date > CURRENT_DATE OR $2::time > LOCALTIME) AS is_future`,
            [date, time],
        );
        if (!dateCheck.rows[0].is_valid || !dateCheck.rows[0].is_future) {
            return res.status(400).json({ error: 'Choose a future date and time.' });
        }

        const result = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time)
             VALUES ($1, $2, $3, $4)
             RETURNING id,
                       to_char(appointment_date, 'YYYY-MM-DD') AS appointment_date,
                       to_char(appointment_time, 'HH24:MI') AS appointment_time,
                       status`,
            [req.userId, doctorId, date, time],
        );
        return res.status(201).json({ ...result.rows[0], doctor_id: doctorId });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'That time was just booked. Please choose another slot.' });
        }
        if (error.code === '22008' || error.code === '22007') {
            return res.status(400).json({ error: 'Choose a valid date and time.' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Could not book this appointment.' });
    }
}

async function cancelAppointment(req, res) {
    const appointmentId = Number(req.params.id);
    if (!Number.isInteger(appointmentId) || appointmentId < 1) {
        return res.status(400).json({ error: 'Invalid appointment.' });
    }

    try {
        const result = await pool.query(
            `UPDATE appointments SET status = 'cancelled'
             WHERE id = $1 AND patient_id = $2 AND status = 'confirmed'
             RETURNING id`,
            [appointmentId, req.userId],
        );
        if (!result.rowCount) {
            return res.status(404).json({ error: 'Appointment not found or already cancelled.' });
        }
        return res.json({ cancelled: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not cancel this appointment.' });
    }
}

module.exports = { listAppointments, bookAppointment, cancelAppointment };