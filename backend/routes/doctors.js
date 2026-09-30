// Doctor routes expose the doctor directory and detail endpoints used by the mobile app.
const express = require('express');
const { listDoctors, getDoctor } = require('../controllers/doctors-controller');

const router = express.Router();

router.get('/', listDoctors);
router.get('/:id', getDoctor);

module.exports = router;