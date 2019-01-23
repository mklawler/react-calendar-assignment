'use strict';

// IMPORTS
let config = require('./config/config.json');

// Get correct config
let cfg;
switch(process.env.NODE_ENV) {
    case "test": {
        cfg = config.test;
        break;
    }
    case "production": {
        cfg = config.production;
        break;
    }
    default: {
        cfg = config.development;
    }

}

// Are we in debug mode?
const DEBUG = typeof v8debug === 'object';

// Log errors to console
exports.logError = function(err) {
    console.error(err,err.src);
}

// If we are in debug mode or explicitly in Development or Test config, log info lines
// to console.  This is extra info that can be helpful in debugging.

exports.logInfo = function(info) {
    if (DEBUG || process.env.NODE_ENV === "Development" || process.env.NODE_ENV === "Test")
        console.log(info);
}



