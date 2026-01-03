'use strict';

// written prior to 11/26/2019
// significant additions 12/30/2019
// including channelizability
// and JSDoc style comments
// added blankNewLine function
// and setModuleLoggingLevel 1/17/2022
//
// adapted for TypeScript import as ES module Jan.2,2026
//
// Rich W.
// license MSL.l

import os from 'os';

const thisModuleFileName = "level-logger.t.js";
const defaultLoggingLevel = -1;


var moduleVars = {
    logging_level: 7,
    suppress_prefix: false,
    llogfunction: null,
    output_redirect: null,
}


/**
 * @param {string} argModuleTag module prefix prepended to indicate the origin of the logged message.
 * @param {function} argOutputRedirect function allowing additional processing of output message.
 * @param {boolean} argSuppressPrefix if true, suppresses module prefix.
 * @param {boolean} argChannelizable if true, allows text log output channels instead of level numbers.
 */
export function getLogger(argModuleTag,
    argOutputRedirect,
    argSuppressPrefix,
    argChannelizable = false) {
    if (!argModuleTag || typeof argModuleTag != 'string') {
        throw new TypeError("Level logger requires module tag string argument value.");
    }
    let returnlogfunction = null;
    /**
     * @param {string} message Message to output to console.
     * @param {number} level Message severity (zero to eight).
     * 0 - program-ending error
     * 1 - immediate action required critical situation
     * 2 - immediate attention required alert
     * 3 - error condition
     * 4 - program state warning
     * 5 - notification message of normal operation
     * 6 - special situation informational message
     * 7 - debugging messages
     * 8 - debugging detail messages
     */
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
    returnlogfunction.blankNewLine = function(fLevel = defaultLoggingLevel) {
        if (fLevel <= moduleVars.logging_level) {
            console.log(os.EOL);
        }
    },
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

getLogger.setModuleLoggingLevel = function setModuleLoggingLevelFunction(argNewLevel, argLogNewLevel) {
    if (typeof argNewLevel != 'number') {
        console.log("Incorrect sMLL argument type.");
    }
    moduleVars.logging_level = argNewLevel;
    if (argLogNewLevel === true) {
        console.log(`New level logger logging level set to '${moduleVars.logging_level}'.`);
    }
}
getLogger.initialLoggingLevel = moduleVars.logging_level;
