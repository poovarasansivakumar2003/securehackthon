require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Import Handlebars helpers
require('./helpers/handlebars');

// Import routes
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register Handlebars partials directory
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Add cookie-parser middleware
app.use(cookieParser());

// Middleware to verify JWT and pass user to all views
app.use((req, res, next) => {
    const token = req.cookies?.token; // Use cookie-parser to access cookies
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
        } catch (err) {
            console.error('Invalid token:', err.message);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    res.locals.successMessage = '';
    next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/community', communityRoutes);
app.use('/training', trainingRoutes);

// 500 handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('500');
});

// 404 handler 
app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
  console.log(`http://localhost:${process.env.PORT || 3000}`);
});