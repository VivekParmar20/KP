const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendAppointmentEmail = async (appointment) => {
    const { name, email, phone, doctor, date} = appointment;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'New Appointment Booking',
        text: `A new appointment has been booked with the following details:\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n` +
              `Phone: ${phone}\n` +
              `Doctor: ${doctor}\n` +
              `Date: ${date}\n` 
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendAppointmentEmail;
