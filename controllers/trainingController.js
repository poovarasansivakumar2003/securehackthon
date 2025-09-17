const { GameSession, UserProgress } = require('../mongodb');

class TrainingController {
    static async getCyberGame(req, res) {
        const user = req.user; // User is guaranteed to exist due to requireAuth middleware
        let userProgress = null;
        
        userProgress = await UserProgress.findOne({ userId: user.id });
        
        res.render('cyberGame', {
            name: `${user.firstName} ${user.lastName}`,
            currentPage: 'training',
            user,
            userProgress
        });
    }

    static async getArchitecture(req, res) {
        const user = req.user;
        let userProgress = null;
        
        userProgress = await UserProgress.findOne({ userId: user.id });
        
        res.render('architecture', {
            name: `${user.firstName} ${user.lastName}`,
            currentPage: 'training',
            user,
            userProgress
        });
    }

    static async getExploit(req, res) {
        const user = req.user;
        let userProgress = null;
        
        userProgress = await UserProgress.findOne({ userId: user.id });
        
        res.render('exploit', {
            name: `${user.firstName} ${user.lastName}`,
            currentPage: 'training',
            user,
            userProgress
        });
    }

    static async getPenetration(req, res) {
        const user = req.user;
        let userProgress = null;
        
        userProgress = await UserProgress.findOne({ userId: user.id });
        
        res.render('penetration', {
            name: `${user.firstName} ${user.lastName}`,
            currentPage: 'training',
            user,
            userProgress
        });
    }

    static async getSocialEngineering(req, res) {
        const user = req.user;
        let userProgress = null;
        
        userProgress = await UserProgress.findOne({ userId: user.id });
        
        res.render('socialEngineering', {
            name: `${user.firstName} ${user.lastName}`,
            currentPage: 'training',
            user,
            userProgress
        });
    }

    // Save game session
    static async saveGameSession(req, res) {
        try {
            const { gameType, score, level, timeSpent, completedChallenges, gameData } = req.body;
            const user = req.user;

            if (!user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            // Create or update game session
            const gameSession = new GameSession({
                userId: user.id,
                userName: user.name,
                gameType,
                score: score || 0,
                level: level || 1,
                timeSpent: timeSpent || 0,
                completedChallenges: completedChallenges || [],
                gameData: gameData || {},
                updatedAt: new Date()
            });

            await gameSession.save();

            // Update user progress
            let userProgress = await UserProgress.findOne({ userId: user.id });
            
            if (!userProgress) {
                userProgress = new UserProgress({
                    userId: user.id,
                    userName: user.name
                });
            }

            // Update statistics
            userProgress.gamesPlayed += 1;
            userProgress.totalScore += score || 0;
            userProgress.lastPlayed = new Date();
            
            // Update high score for specific game
            if (userProgress.highScores[gameType] < (score || 0)) {
                userProgress.highScores[gameType] = score || 0;
            }

            await userProgress.save();

            res.json({ 
                success: true, 
                message: 'Game session saved successfully',
                sessionId: gameSession._id 
            });

        } catch (error) {
            console.error('Error saving game session:', error);
            res.status(500).json({ error: 'Failed to save game session' });
        }
    }

    // Get user progress
    static async getUserProgress(req, res) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const userProgress = await UserProgress.findOne({ userId: user.id });
            const recentSessions = await GameSession.find({ userId: user.id })
                .sort({ createdAt: -1 })
                .limit(10);

            res.json({
                success: true,
                userProgress: userProgress || null,
                recentSessions
            });

        } catch (error) {
            console.error('Error fetching user progress:', error);
            res.status(500).json({ error: 'Failed to fetch user progress' });
        }
    }

    // Get leaderboard page
    static async getLeaderboardPage(req, res) {
        try {
            const user = req.user;
            let userProgress = null;
            
            if (user) {
                userProgress = await UserProgress.findOne({ userId: user.id });
            }

            res.render('leaderboard', {
                name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
                currentPage: 'leaderboard',
                user,
                userProgress: userProgress || {
                    totalScore: 0,
                    gamesPlayed: 0,
                    highScores: {
                        cyberGame: 0,
                        architecture: 0,
                        exploit: 0,
                        penetration: 0,
                        socialEngineering: 0
                    }
                }
            });

        } catch (error) {
            console.error('Error loading leaderboard page:', error);
            res.status(500).render('500');
        }
    }

    // Get leaderboard
    static async getLeaderboard(req, res) {
        try {
            const { gameType } = req.params;
            
            let sortField = 'totalScore';
            let queryFilter = {};
            
            if (gameType && gameType !== 'overall') {
                sortField = `highScores.${gameType}`;
                // Only include users who have played this specific game
                queryFilter[`highScores.${gameType}`] = { $gt: 0 };
            }

            const leaderboard = await UserProgress.find(queryFilter)
                .sort({ [sortField]: -1 })
                .limit(10)
                .select('userName totalScore highScores lastPlayed gamesPlayed');

            res.json({
                success: true,
                leaderboard,
                gameType: gameType || 'overall'
            });

        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            res.status(500).json({ error: 'Failed to fetch leaderboard' });
        }
    }
}

module.exports = TrainingController;