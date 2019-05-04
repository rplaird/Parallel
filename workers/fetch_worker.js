const request = require('request');
const fs = require('fs')
const { parentPort, workerData, isMainThread } = require("worker_threads");

if (!isMainThread) {
    getRange(workerData.url, workerData.connection, workerData.chunksize);
}

function getRange(url, connection, chunksize) {

    const start = connection * chunksize;
    const end = start + chunksize - 1;

    const options = {
        url: url,
        headers: {
            'Range': 'bytes=' + start + '-' + end
        }
    };

    request(options).pipe(fs.createWriteStream(connection + ""));
}
