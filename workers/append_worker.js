const fs = require('fs')
const { parentPort, workerData, isMainThread } = require("worker_threads");

if (!isMainThread) {
    appendPart(0, workerData);
}

function appendPart(partNumber, numParts) {

    if (partNumber < numParts) {

        fs.readFile(partNumber + "", (err, data) => {
            if (err) {
                throw err;
            }
            fs.appendFile('result.png', data, (err) => {
                if (err) {
                    throw err;
                }
                fs.unlink(partNumber + "", (err) => {
                    if (err) {
                        throw err;
                    }
                });

                let nextPart = partNumber + 1;
                appendPart(nextPart, numParts);
            });
        });
    }
}