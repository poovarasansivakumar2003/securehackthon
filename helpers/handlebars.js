const hbs = require('hbs');

// Register formatDate helper
hbs.registerHelper('formatDate', function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
});

// Register comparison helpers
hbs.registerHelper('eq', function(a, b) {
    return a === b;
});

hbs.registerHelper('gt', function(a, b) {
    return a > b;
});

// Register JSON stringify helper
hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

module.exports = hbs;