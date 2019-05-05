/* eslint-disable no-unused-vars */

/**
 * Module dependencies.
 */
const fs = require('fs')
const { parentPort, workerData, isMainThread } = require("worker_threads");

// Should only be invoked in a worker thread.
if (!isMainThread) {
    // Call local function to add first file part to the output file.
    appendPart(0, workerData.connections);
}

/**
 * Function that appends a file part content to the output file.
 * Called recursively for each part ( part per connection ).
*/
function appendPart(partNumber, numParts) {

    // breaks the recursion.
    if (partNumber < numParts) {

        // read bytes
        fs.readFile(partNumber + "", (err, data) => {
            if (err) {
                throw err;
            }
            // append bytes to output
            fs.appendFile(workerData.output, data, (err) => {
                if (err) {
                    throw err;
                }
                // delete the file part after its been written.
                fs.unlink(partNumber + "", (err) => {
                    if (err) {
                        throw err;
                    }
                });

                // Increment to next file part id.
                let nextPart = partNumber + 1;
                // Recursively call this method.
                appendPart(nextPart, numParts);
            });
        });
    }
}