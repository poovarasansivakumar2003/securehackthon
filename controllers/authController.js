const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../mongodb');

class AuthController {
    // Render login page
    static getLogin(req, res) {
        res.render('login', { 
            content: '',
            currentPage: 'login'
        });
    }

    // Render signup page
    static getSignup(req, res) {
        res.render('signup', { 
            content: '',
            currentPage: 'signup'
        });
    }

    // Handle user signup
    static async postSignup(req, res) {
        try {
            const { name, firstName, lastName, email, password, location } = req.body;

            // Input validation
            if (!name || !firstName || !lastName || !email || !password || !location) {
                return res.render('signup', { 
                    content: 'All fields are required', 
                    wrongPassword: "Missing fields",
                    currentPage: 'signup'
                });
            }

            if (password.length < 6) {
                return res.render('signup', { 
                    content: 'Password must be at least 6 characters', 
                    wrongPassword: "Weak password",
                    currentPage: 'signup'
                });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('signup', { 
                    content: 'Email already in use', 
                    wrongPassword: "Email taken",
                    currentPage: 'signup'
                });
            }

            const newUser = new User({ name, firstName, lastName, email, password, location });
            await newUser.save();

            res.redirect('/auth/login');
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).render('signup', { 
                content: 'Server error occurred', 
                wrongPassword: "Server error",
                currentPage: 'signup'
            });
        }
    }

    // Handle user login
    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.render('login', { 
                    content: 'Email and password required', 
                    wrongPassword: 'Missing credentials',
                    currentPage: 'login'
                });
            }

            const user = await User.findOne({ email }).lean();
            if (!user) {
                return res.render('login', { 
                    content: 'Invalid email or password', 
                    wrongPassword: 'Invalid credentials',
                    currentPage: 'login'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', { 
                    wrongPassword: 'Invalid email or password',
                    currentPage: 'login'
                });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).render('login', { 
                content: 'Server error occurred', 
                wrongPassword: 'Server error',
                currentPage: 'login'
            });
        }
    }

    // Handle user logout
    static logout(req, res) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
}

module.exports = AuthController;