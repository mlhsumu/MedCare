// This file boots the MedCare backend server.
// It creates the API, attaches all route groups, and initializes the database before starting the app.
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./config/init-db');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'MedCare API is running'
    });
});

const PORT = Number(process.env.PORT || 5001);

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`MedCare API running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Could not initialize the MedCare database.', error);
        process.exitCode = 1;
    });