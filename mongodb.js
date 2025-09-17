const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URI);

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

// Game Session Schema
const gameSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Authentication', required: true },
    userName: { type: String, required: true },
    gameType: { 
        type: String, 
        required: true,
        enum: ['cyberGame', 'architecture', 'exploit', 'penetration', 'socialEngineering']
    },
    score: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    timeSpent: { type: Number, default: 0 }, // in seconds
    completedChallenges: [{ type: String }],
    gameData: { type: mongoose.Schema.Types.Mixed }, // Store specific game state
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// User Progress Schema
const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Authentication', required: true },
    userName: { type: String, required: true },
    totalScore: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    highScores: {
        cyberGame: { type: Number, default: 0 },
        architecture: { type: Number, default: 0 },
        exploit: { type: Number, default: 0 },
        penetration: { type: Number, default: 0 },
        socialEngineering: { type: Number, default: 0 }
    },
    achievements: [{ type: String }],
    lastPlayed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const CommunityPost = mongoose.model('CommunityPost', postSchema);
const User = mongoose.model('Authentication', LoginSchema);
const Helpline = mongoose.model('Helpline', HelplineSchema);
const GameSession = mongoose.model('GameSession', gameSessionSchema);
const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = { User, Helpline, CommunityPost, GameSession, UserProgress };