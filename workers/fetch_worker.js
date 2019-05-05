/* eslint-disable no-unused-vars */

/**
 * Module dependencies.
 */
const request = require('request');
const fs = require('fs')
const { parentPort, workerData, isMainThread } = require("worker_threads");

// Should only be invoked in a worker thread.
if (!isMainThread) {
    // Call local function to fetch portion of download.
    getRange(workerData.url, workerData.connection, workerData.chunksize);
}

/**
 * Used connection number ( id ) to calculate target byte range.
 * Add to header.
 * Make request and pipe output to file stream.
 */
function getRange(url, connection, chunksize ) {

    const start = connection * chunksize;
    const end = start + chunksize - 1;

    const options = {
        url: url,
        headers: {
            'Range': 'bytes=' + start + '-' + end
        }
    };
    
    /**
     * Use connection number ( id ) as tmp filename for 
     * the range being downloaded.
     */ 
    request(options).pipe(fs.createWriteStream(connection + ""));
}
