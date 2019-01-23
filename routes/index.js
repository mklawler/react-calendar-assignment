'use strict';

// IMPORTS
let express = require('express');
let router = express.Router();
let calendarAPI = require('../controllers/calendar');


// REST API Routes

/* READ calendar for the month */
router.get('/api/calendar/:year/:month', calendarAPI.getMonth);


/* CREATE calendar entry for a given day */
router.post('/api/calendar/:year/:month/:day', calendarAPI.createDay);    // Not implemented yet


/* UPDATE calendar entry for a given day */
router.put('/api/calendar/:year/:month/:day', calendarAPI.updateDay);     // Not implemented yet


/* DELETE calendar entry for a given day */
router.delete('/api/calendar/:year/:month/:day', calendarAPI.deleteDay);  // Not implemented yet

module.exports = router;
