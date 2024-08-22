require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const appointmentRoutes = require('./routes/appointment');

const indexRoutes = require('./routes/index');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set path to views directory

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join for serving static files

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

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
    saveUninitialized: false
}));



 
app.get('/treatments', (req, res) => {
    res.render('treatment'); // Adjust path if necessary
});


// Routes
app.use('/', indexRoutes);
app.use('/appointment', appointmentRoutes);
app.use("*",(req,res)=>{
    res.send("Path not found");
});

// Start server
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
