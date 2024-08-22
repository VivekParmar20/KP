const express = require('express');
const router = express.Router();

// Route for home
router.get('/', (req, res) => {
    res.render('index');
});

// Route for /about
router.get('/about', (req, res) => {
    res.render('about');
});

// Route for /doctors
router.get('/doctors', (req, res) => {
    // In a real application, you would fetch doctor data from a database
    const doctorss = [
        { name: 'Dr. Keval Parmar (Gold Medalist)', specialization: 'Orthopadic Surgeon' },
        { name: 'Dr. Poma Shah', specialization: 'MD Physician' }
    ];
    res.render('doctors', { doctorss });
});

module.exports = router;
