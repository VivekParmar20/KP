const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const sendAppointmentEmail = require('../utils/mailer');

// Dummy data for doctors (replace with real data from your database or another source)
const doctors = [
    { name: 'Keval Parmar', specialty: 'Orthopedic Surgeon' },
    { name: 'Poma Shah', specialty: 'MD Physician' }
];

// Helper function to check if a date is a weekend
const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
};

// Route for /appointment (GET)
router.get('/', (req, res) => {
    res.render('appointment', {
        title: 'Book an Appointment',
        doctors: doctors
    });
});

// Route for handling form submission (POST)
router.post('/', async (req, res) => {
    const { name, email, phone, doctor, date } = req.body;

    const appointmentDate = new Date(date);
    const today = new Date();

    // Check if the date is in the past
    if (appointmentDate < today) {
        req.flash('error_msg', 'Invalid date: Appointment cannot be in the past');
        return res.redirect('/appointment');
    }

    // Check if the date falls on a weekend
    if (isWeekend(appointmentDate)) {
        req.flash('error_msg', 'Invalid date: Appointments cannot be booked on weekends');
        return res.redirect('/appointment');
    }

    try {
        // Create a new appointment
        const newAppointment = new Appointment({
            name,
            email,
            phone,
            doctor,
            date
        });

        // Save the appointment to the database
        await newAppointment.save();

        // Send email to owner
        await sendAppointmentEmail(newAppointment);

        // Redirect to the home page after successful booking
        req.flash('success_msg', 'Appointment booked successfully');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'There was an error booking your appointment');
        res.redirect('/appointment');
    }
});

module.exports = router;
