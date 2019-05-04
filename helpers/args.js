var args = require('commander');
const URL = require("url").URL;

const DEFAULT_CONNECTIONS = 4;
const DEFAULT_CHUNKSIZE = 1048576;
const DEFAULT_OUTPUT = "output.png";

function validateURL(url) {
    try {
        new URL(url);
        return url;
    } catch (error) {
        return false;
    }
}

module.exports = {

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
    validateArgs: function (args) {

        var success = true;

        if (!args.connections) args.connections = DEFAULT_CONNECTIONS;
        else if ( args.connections === true ) {
            console.log("--connections is invalid or blank.");
            success = false;
        }

        if (!args.chunksize) args.chunksize = DEFAULT_CHUNKSIZE;
        else if ( args.chunksize === true ) {
            console.log("--chunksize is invalid or blank.");
            success = false;
        }

        if (!args.output) args.output = DEFAULT_OUTPUT;
        else if (args.output === true) {
            console.log("--output is invalid or blank.");
            success = false;
        }

        if (!args.url || args.url === true) {
            console.log("url is invalid or blank.");
            success = false;
        }

        return success;
    }
};

