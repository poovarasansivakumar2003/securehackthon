require('dotenv').config(); // Suppress dotenv logs
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

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>500 - Server Error</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div class="text-center">
                <h1 class="text-8xl font-bold text-red-500">500</h1>
                <p class="text-2xl text-gray-300 mt-4">Oops! Something went wrong on our end.</p>
                <a href="/" class="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Return to Home
                </a>
            </div>
        </body>
        </html>
    `);
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div class="text-center">
                <h1 class="text-8xl font-bold text-gray-500">404</h1>
                <p class="text-2xl text-gray-300 mt-4">Sorry, the page you are looking for does not exist.</p>
                <a href="/" class="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Go to Home
                </a>
            </div>
        </body>
        </html>
    `);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
  console.log(`http://localhost:${process.env.PORT || 3000}`);
});