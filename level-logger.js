'use strict';

// written 11/26/2019
// Rich W.

const thisModuleFileName = "level-logger.js";
const defaultLoggingLevel = -1;


var moduleVars = {
    logging_level: 7,
    suppress_prefix: false,
    llogfunction: null,
    output_redirect: null,
}


//todo: JSDoc or even TypeScript definitions
function getLogger(argModuleTag,
    argOutputRedirect,
    argSuppressPrefix,
    argChannelizable = false) {
    if (!argModuleTag || typeof argModuleTag != 'string') {
        throw new TypeError("Level logger requires module tag string argument value.");
    }
    /**
     * @param {string} message Message to output to console.
     * @param {number} level Message severity (zero to eight).
     * 0 - program-ending error
     * 1 - immediate action required alert
     * 2 - immediate attention required critical situation
     * 3 - error condition
     * 4 - program state warning
     * 5 - notification message of normal operation
     * 6 - special situation informational message
     * 7 - debugging messages
     * 8 - debugging detail messages
     */
    let returnlogfunction = null;
    var logfunction = function (fMessage,
        fLevel = defaultLoggingLevel,
        fSuppressPrefix = moduleVars.suppress_prefix) {
        if (fLevel <= moduleVars.logging_level) {
            let logmesg = null;
            if (fSuppressPrefix) {
                logmesg = fMessage;
            } else {
                logmesg = `${argModuleTag} (lvl.${fLevel}): ${fMessage}`;
            }
            let logtoconsole = !moduleVars.output_redirect;
            if (!logtoconsole) {
                logtoconsole = moduleVars.output_redirect(logmesg);
            }
            if (logtoconsole) {
                console.log(logmesg);
            }
        }
    };
    var channelizablelogfunction = function (fMessage,
        fLevel = defaultLoggingLevel,
        fSuppressPrefix = moduleVars.suppress_prefix) {
        let logmesg = null;
        if (typeof fLevel == 'string') {
            if (fSuppressPrefix) {
                logmesg = fMessage
            } else {
                logmesg = `${argModuleTag} ${fLevel} chnl.: ${fMessage}`;
            }
        }
        if (fLevel <= moduleVars.logging_level) {
            if (fSuppressPrefix) {
                logmesg = fMessage;
            } else {
                logmesg = `${argModuleTag} (lvl.${fLevel}): ${fMessage}`;
            }
        }
        let logtoconsole = !moduleVars.output_redirect;
        if (!logtoconsole) {
            logtoconsole = moduleVars.output_redirect(logmesg);
        }
        if (logtoconsole) {
            console.log(logmesg);
        }
    };
    if (argChannelizable) {
        returnlogfunction = channelizablelogfunction;
    } else {
        returnlogfunction = logfunction;
    }
    returnlogfunction.setSuppressPrefix = function (value) {
        if (typeof value !== 'boolean') {
            if (!moduleVars.llogfunction) {
                moduleVars.llogfunction = getLogger(thisModuleFileName);
            }
            llogfunction("suppress prefix value must be a boolean.", 3);
        }
        moduleVars.suppress_prefix = value;
    };
    returnlogfunction.setLoggingLevel = function (argLevel) {
        const argvalue = parseInt(argLevel);
        let logmesg = null;
        let logmesglevel = 5
        let returnval = true;
        if (Number.isInteger(argvalue)) {
            moduleVars.logging_level = argvalue;
            if (moduleVars.logging_level >= 5) {
                logmesg = `logging level set to ${argvalue}`;
            }
        } else {
            logmesg = `setLoggingLevel parameter should be an integer`;
            logmesglevel = 3;
            returnval = false;
        }
        if (logmesg) {
            if (!moduleVars.llogfunction) {
                moduleVars.llogfunction = getLogger(thisModuleFileName);
            }
            moduleVars.llogfunction(logmesg, logmesglevel);
        }
        return returnval;
    };
    returnlogfunction.getLoggingLevel = function () {
        return moduleVars.logging_level;
    };
    returnlogfunction.setRedirectFunction = function (argRedirectFunction) {
        let logmesg = null;
        let logmesglevel = 5
        let returnval = true;
        if (typeof argRedirectFunction == 'function') {
            moduleVars.output_redirect = argRedirectFunction;
            if (moduleVars.logging_level >= 5) {
                logmesg = `redirect output function changed`;
            }
        } else {
            logmesg = `setRedirectFunction parameter should be a function`;
            logmesglevel = 3;
            returnval = false;
        }
        if (logmesg) {
            if (!moduleVars.llogfunction) {
                moduleVars.llogfunction = getLogger(thisModuleFileName);
            }
            moduleVars.llogfunction(logmesg, logmesglevel);
        }
        return returnval;
    };
    returnlogfunction.defaultLoggingLevel = defaultLoggingLevel;
    //
    if (argSuppressPrefix || argSuppressPrefix === false) {
        returnlogfunction.setSuppressPrefix(argSuppressPrefix);
    }
    if (argOutputRedirect) {
        returnlogfunction.setRedirectFunction(argOutputRedirect);
    }
    return returnlogfunction;
};

module.exports = getLogger;