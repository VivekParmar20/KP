require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path'); // Import path module

const appointmentRoutes = require('./routes/appointment');
const indexRoutes = require('./routes/index');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set path to views directory

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join for serving static files

// Body parser middleware (using built-in Express middleware)
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
});

// Express session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

app.use(flash());

// Middleware to pass flash messages to EJS templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/', indexRoutes);
app.use('/appointment', appointmentRoutes);
app.get('/treatments', (req, res) => {
    res.render('treatment'); // Ensure the filename matches exactly
});

const cors = require('cors');
app.use(cors());


// Catch-all route for undefined paths
app.use('*', (req, res) => {
    res.status(404).send("Path not found");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
