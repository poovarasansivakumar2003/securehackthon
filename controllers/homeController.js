class HomeController {
    static getHome(req, res) {
        const user = req.user || null;
        res.render('index', {
            content: user ? 'Log Out' : 'Login',
            name: user ? `${user.firstName} ${user.lastName}` : 'User',
            form: user ? '/logout' : '/login',
            successMessage: '',
            currentPage: 'home'
        });
    }

    static getTraining(req, res) {
        const user = req.user || null;
        res.render('training', {
            name: user ? `${user.firstName} ${user.lastName}` : 'User',
            currentPage: 'training'
        });
    }

    static getLab(req, res) {
        const user = req.user || null;
        res.render('lab', {
            name: user ? `${user.firstName} ${user.lastName}` : 'User',
            currentPage: 'lab'
        });
    }

    static getQuiz(req, res) {
        const user = req.user || null;
        res.render('quiz', {    
            name: user ? `${user.firstName} ${user.lastName}` : 'User',
            currentPage: 'quiz'
        }); 
    }

    static getHelpline(req, res) {
        const user = req.user || null;
        res.render('helpline', {
            name: user ? `${user.firstName} ${user.lastName}` : 'User',
            currentPage: 'helpline'
        });
    }
}

module.exports = HomeController;
