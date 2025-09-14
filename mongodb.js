const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URI);

// User Schema and Model
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

LoginSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        console.log('Hashed password:', hashPassword);
        this.password = hashPassword;
        next();
    } catch (error) {
        console.log('Error while hashing password:', error);
        next(error);
    }
});

LoginSchema.methods.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Helpline Schema
const HelplineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    }
});

// Community Post Schema - Define replySchema first
const replySchema = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now }
});

const CommunityPost = mongoose.model('CommunityPost', postSchema);
const User = mongoose.model('Authentication', LoginSchema);
const Helpline = mongoose.model('Helpline', HelplineSchema);

module.exports = { User, Helpline, CommunityPost };