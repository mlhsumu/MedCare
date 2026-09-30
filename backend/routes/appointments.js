// Appointment routes for patient booking and cancellation.
// These endpoints require a valid signed-in user before they can be used.
const express = require('express');
const requireAuth = require('../middleware/require-auth');
const {
    listAppointments,
    bookAppointment,
    cancelAppointment,
} = require('../controllers/appointments-controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', listAppointments);
router.post('/', bookAppointment);
router.delete('/:id', cancelAppointment);

module.exports = router;