

// Are we in debug mode?
const DEBUG = typeof v8debug === 'object';

// Log errors to console
exports.logError = function(err) {
    try {
        console.error(err,err.src);
    }
    catch(e){
        try {
            console.error(err);
        }
        catch(e){}
    }
};

// If we are in debug mode or explicitly in Development or Test config, log info lines
// to console.  This is extra info that can be helpful in debugging.

exports.logInfo = function(info) {
    if (DEBUG || process.env.NODE_ENV === "Development" || process.env.NODE_ENV === "Test")
        console.log(info);
};



