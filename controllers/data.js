'use strict';

// IMPORTS
let fs = require('fs');

// Reads file from
exports.read = (cb) => {
    fs.readFile('./data/calendar.json', (err, d) => {
        if (err) throw err;
        cb(d);
    });
}