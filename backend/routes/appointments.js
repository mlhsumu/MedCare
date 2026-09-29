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