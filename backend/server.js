const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'MedCare API is running'
    });
});

app.get('/doctors', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM doctors ORDER BY id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Database error'
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`MedCare API running on port ${PORT}`);
});