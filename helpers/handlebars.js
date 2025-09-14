const hbs = require('hbs');

// Register the eq helper for comparing values in templates
hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

module.exports = hbs;