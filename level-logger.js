'use strict';

// written 11/26/2019
// Rich W.

const thisModule = "level-logger.js";
const defaultLoggingLevel = -1;

var logging_level = 8;
var suppress_prefix = false;
var log = null;


//todo: JSDoc
function getLogger(argModuleTag, argOutputRedirect, argSuppressPrefix) {
    suppress_prefix = argSuppressPrefix;
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
    var logfunction = function (fMessage,
        fLevel = defaultLoggingLevel,
        suppressPrefix = suppress_prefix) {
        if (fLevel <= logging_level) {
            let logmesg = `${argModuleTag} (lvl.${fLevel}): ${fMessage}`;
            if (suppressPrefix) {
                logmesg = fMessage;
            }
            let logtoconsole = true;
            if (argOutputRedirect) {
                logtoconsole = argOutputRedirect(logmesg);
            }
            if (logtoconsole) {
                console.log(logmesg);
            }
        }
    };
    logfunction.setSuppressPrefix = function (value) {
        if (typeof value !== 'boolean') {
            if (!log) {
                log = getLogger(thisModule);
            }
            log("suppress prefix value must be a boolean.", 3);
        }
        suppress_prefix = value;
    };
    logfunction.setLoggingLevel = function (argLevel) {
        logging_level = argLevel;
        if (!log) {
            log = getLogger(thisModule);
        }
        log(`setting new logging level to ${argLevel}`, 5);
        return true;
    };
    logfunction.getLoggingLevel = function () {
        return logging_level;
    };
    return logfunction;
};

module.exports = getLogger;
