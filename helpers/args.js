/* eslint-disable no-console */
/* eslint-disable no-undef */

/**
 * Module dependencies.
 */
var args = require('commander');
const URL = require("url").URL;

/**
 * Program defaults.
 */
const DEFAULT_CONNECTIONS = 4;
const DEFAULT_CHUNKSIZE = 1048576;  // 1 meg
const DEFAULT_OUTPUT = "output.bin";

/**
 * Cheap and cheerful method to validate a URL.
 * Called by the .option('-u, --url [url]', 'file url', validateURL)
 * entry in getargs function.
 */
function validateURL(url) {
    try {
        new URL(url);
        // if you made it here the url is in the correct format.
        return url;
    } catch (error) {
        // Bad string for url entered. 
        return false;
    }
}

module.exports = {

    // init options and parse the commandline with commander library.
    getArgs: function () {
        args
            .version('0.1.0')
            .option('-u, --url [url]', 'file url', validateURL)
            .option('-c, --connections [n]', 'number of connections', parseInt)
            .option('-C, --chunksize [n]', 'size in bytes', parseInt)
            .option('-o, --output [filename]', 'filename')
            .parse(process.argv);
        return args
    },

    // Validate the args and assign defaults if optional.
    // If an argument switch is present, but has no value,
    // commander will return 'true' for the arg. Handle as error.
    validateArgs: function (args) {

        var success = true;
        // not specified. apply default.
        if (!args.connections) args.connections = DEFAULT_CONNECTIONS;
        // Command present but has no value.
        else if ( args.connections === true ) {
            console.log("--connections is invalid or blank.");
            success = false;
        }

        // not specified. apply default.
        if (!args.chunksize) args.chunksize = DEFAULT_CHUNKSIZE;
        // Command present but has no value.
        else if ( args.chunksize === true ) {
            console.log("--chunksize is invalid or blank.");
            success = false;
        }

        // not specified. apply default.
        if (!args.output) args.output = DEFAULT_OUTPUT;
        // Command present but has no value.
        else if (args.output === true) {
            console.log("--output is invalid or blank.");
            success = false;
        }

        // No default for url. URL is mandatory.
        if (!args.url || args.url === true) {
            console.log("url is invalid or blank.");
            success = false;
        }

        return success;
    }
};

