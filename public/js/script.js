// DOM Elements
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');
const terminalContent = document.querySelector('.terminal-content');
const notificationContainer = document.getElementById('notification-container');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Notification System
class NotificationSystem {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = document.createElement('i');
        icon.className = this.getIconClass(type);
        
        const text = document.createElement('span');
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        
        notificationContainer.appendChild(notification);
        
        // Remove notification after duration
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    static getIconClass(type) {
        switch(type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            default:
                return 'fas fa-info-circle';
        }
    }
}

// Terminal Simulation
class TerminalSimulation {
    constructor(element) {
        this.element = element;
        this.commandHistory = [];
        this.currentIndex = -1;
        this.setupTerminal();
    }
    
    setupTerminal() {
        this.element.innerHTML = '';
        this.addLine('Welcome to CyberGuard Terminal');
        this.addLine('Type "help" for available commands');
        this.addPrompt();
        
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = this.getCurrentInput();
                this.handleCommand(input);
            }
        });
    }
    
    addLine(text) {
        const line = document.createElement('div');
        line.textContent = text;
        this.element.appendChild(line);
    }
    
    addPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'terminal-prompt';
        prompt.innerHTML = 'root@cyberlab:~# <span contenteditable="true" class="terminal-input"></span>';
        this.element.appendChild(prompt);
        
        const input = prompt.querySelector('.terminal-input');
        input.focus();
    }
    
    getCurrentInput() {
        return this.element.querySelector('.terminal-input').textContent;
    }
    
    handleCommand(command) {
        this.commandHistory.push(command);
        this.currentIndex = this.commandHistory.length;
        
        switch(command.toLowerCase()) {
            case 'help':
                this.addLine('Available commands:');
                this.addLine('- help: Show this help message');
                this.addLine('- clear: Clear the terminal');
                this.addLine('- scan: Perform a security scan');
                break;
            
            case 'clear':
                this.setupTerminal();
                return;
            
            case 'scan':
                this.performScan();
                break;
            
            default:
                this.addLine(`Command not found: ${command}`);
        }
        
        this.addPrompt();
    }
    
    performScan() {
        const steps = [
            'Initializing security scan...',
            'Checking system vulnerabilities...',
            'Analyzing network traffic...',
            'Scanning for malware...',
            'Generating report...'
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            this.addLine(steps[i]);
            i++;
            
            if (i >= steps.length) {
                clearInterval(interval);
                this.addLine('Scan complete! No vulnerabilities found.');
                this.addPrompt();
            }
        }, 1000);
    }
}

// Progress Tracking
class ProgressTracker {
    static updateProgress(elementId, progress) {
        const progressBar = document.querySelector(`#${elementId} .progress`);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
        }
    }
}

// Initialize Terminal
if (terminalContent) {
    const terminal = new TerminalSimulation(terminalContent);
}

// Quest Timer System
class QuestTimer {
    constructor(element) {
        this.element = element;
        this.timeRemaining = 24 * 60 * 60; // 24 hours in seconds
        this.start();
    }
    
    start() {
        this.interval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.interval);
                NotificationSystem.show('Daily quest has expired!', 'warning');
            }
        }, 1000);
    }
    
    updateDisplay() {
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        
        this.element.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Initialize Quest Timers
document.querySelectorAll('.time-remaining').forEach(element => {
    new QuestTimer(element);
});

// Example Usage
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome notification
    NotificationSystem.show('Welcome to CyberGuard Training Platform!', 'success');
    
    // Initialize progress tracking for demo
    setInterval(() => {
        const randomProgress = Math.floor(Math.random() * 100);
        ProgressTracker.updateProgress('current-module', randomProgress);
    }, 5000);
});

// Achievement System
class AchievementSystem {
    static unlock(achievementId) {
        const achievement = document.querySelector(`#${achievementId}`);
        if (achievement && achievement.classList.contains('locked')) {
            achievement.classList.remove('locked');
            NotificationSystem.show('New Achievement Unlocked!', 'success');
        }
    }
}

// Event Listeners for Interactive Elements
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', () => {
        NotificationSystem.show('Starting activity...', 'info');
    });
});

// Implement smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



// white team js --------------------------------

// Team Selection and Management (continued)
class TeamSystem {
    constructor() {
        this.currentTeam = localStorage.getItem('userTeam') || null;
        this.initializeTeamSelection();
        this.updateTeamIndicator();
    }

    initializeTeamSelection() {
        const teamButtons = document.querySelectorAll('.btn-team-select');
        teamButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedTeam = e.target.dataset.team;
                this.selectTeam(selectedTeam);
            });
        });
        
        // Show team selection if no team is selected
        if (!this.currentTeam) {
            this.showTeamSelection();
        } else {
            this.showTeamHub();
        }

        // Add team hub navigation handling
        const teamHubLink = document.querySelector('.team-hub-link');
        teamHubLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showTeamHub();
        });
    }

    selectTeam(team) {
        this.currentTeam = team;
        localStorage.setItem('userTeam', team);
        
        // Update UI
        this.updateTeamIndicator();
        this.showTeamHub();
        
        // Show welcome notification
        NotificationSystem.show(`Welcome to the ${team.toUpperCase()} Team! Your training begins now.`, 'success');
    }

    updateTeamIndicator() {
        const indicator = document.getElementById('userTeamIndicator');
        if (this.currentTeam) {
            indicator.textContent = `${this.currentTeam.toUpperCase()} Team`;
            indicator.className = `team-indicator ${this.currentTeam}-team`;
        } else {
            indicator.textContent = '';
            indicator.className = 'team-indicator';
        }
    }

    showTeamSelection() {
        // Hide all sections
        this.hideAllSections();
        
        // Show team selection section
        const teamSelection = document.getElementById('team-selection');
        teamSelection.classList.remove('hidden-section');
    }

    showTeamHub() {
        if (!this.currentTeam) {
            this.showTeamSelection();
            return;
        }

        // Hide all sections
        this.hideAllSections();
        
        // Show appropriate team hub
        const teamHub = document.getElementById(`${this.currentTeam}-team-hub`);
        teamHub.classList.remove('hidden-section');
        
        // Update team-specific content
        this.updateTeamHub();
    }

    hideAllSections() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => section.classList.add('hidden-section'));
    }

    updateTeamHub() {
        if (!this.currentTeam) return;

        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-bar .progress');
        progressBars.forEach(bar => {
            const randomProgress = Math.floor(Math.random() * 100);
            bar.style.width = `${randomProgress}%`;
            bar.textContent = `${randomProgress}%`;
        });

        // Update team statistics
        this.updateTeamStats();
    }

    updateTeamStats() {
        const stats = {
            red: {
                rank: ['Elite', 'Veteran', 'Advanced', 'Intermediate', 'Beginner'],
                operations: Math.floor(Math.random() * 5) + 1,
                successRate: Math.floor(Math.random() * 30) + 70
            },
            white: {
                rating: ['A+', 'A', 'B+', 'B', 'C+'],
                defenses: Math.floor(Math.random() * 5) + 3,
                preventionRate: Math.floor(Math.random() * 15) + 85
            }
        };

        if (this.currentTeam === 'red') {
            const rankIndex = Math.floor(Math.random() * stats.red.rank.length);
            document.querySelector('.team-stats').innerHTML = `
                <span>Team Rank: ${stats.red.rank[rankIndex]}</span>
                <span>Active Operations: ${stats.red.operations}</span>
                <span>Success Rate: ${stats.red.successRate}%</span>
            `;
        } else if (this.currentTeam === 'white') {
            const ratingIndex = Math.floor(Math.random() * stats.white.rating.length);
            document.querySelector('.team-stats').innerHTML = `
                <span>Security Rating: ${stats.white.rating[ratingIndex]}</span>
                <span>Active Defenses: ${stats.white.defenses}</span>
                <span>Prevention Rate: ${stats.white.preventionRate}%</span>
            `;
        }
    }
}

// Notification System
class NotificationSystem {
    static show(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Initialize team system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof TeamSystem !== 'undefined') {
        window.teamSystem = new TeamSystem();
    }
});