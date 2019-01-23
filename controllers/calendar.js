'use strict';

// IMPORTS
let data = require('../controllers/data');

// Filter out calendar data for the given month/year
exports.getMonth = function(req, res)  {

    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    try {
        let year = req.params.year;

        let month = req.params.month;
        //console.log("year");
        data.read(function (d) {
            let calendar = JSON.parse(d);
            //const result = calendar.find(c => (c.years.year === year)).find(d => (d.months.month === month));
            let yr = null;
            let result = {};
            if (calendar != null) {
                yr = calendar.years.find(c => c.year === year);
            }
            if (yr != null) {
                result = yr.months.find(c => c.month === month);
            }
            if ((result == null) || (result == undefined))
                result = {};
            res.json(result);
        })
    }
    catch(e) {
        res.json({});
    }

}

// FUTURE USE
exports.createDay = function(req,res) {

    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    try {

    }
    catch(err) {

    }
}

// FUTURE USE
exports.updateDay = function(req,res) {

    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    try {


    }
    catch(err) {

    }
}

// FUTURE USE
exports.deleteDay = function(req,res) {

    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    try {


    }
    catch(err) {

    }
}