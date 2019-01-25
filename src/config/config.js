

// IMPORTS
let config = require('./config.json');


/************************************************************************
 *
 *          Name: getConfiguration
 *        Author: Mike Lawler
 *          Date: 190124
 *       Purpose: This function uses the config.json to retrieve settings
 *                based off the NODE_ENV environment variable.  This way
 *                we can easily toggle which settings are being used just
 *                by switching the environment.  If it cannot determine the
 *                environment, defaults to development to avoid prod
 *                collisions.
 *     Revisions:
 *
 ************************************************************************/
exports.getConfiguration = function() {

    let cfg=null;
    if (cfg == null) {
        switch (process.env.NODE_ENV) {
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
    }

    return cfg;
};

