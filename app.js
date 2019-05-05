const argsHelper = require('./helpers/args');
const { Worker } = require("worker_threads");
const path = require("path");

const crypto = require('crypto');
const fs = require('fs');

const fetchWorkerScript = path.join(__dirname, "./workers/fetch_worker.js");
const appendWorkerScript = path.join(__dirname, "./workers/append_worker.js");

args = argsHelper.getArgs();

if (!argsHelper.validateArgs(args)) {
    args.help();
}

var content = {
    connections: args.connections,
    url: args.url,
    chunksize: args.chunksize,
    output: args.output
}

console.log('fetching  %s in %i sized chunks with %i connections', args.url, args.chunksize, args.connections);

for (var i = 0; i < args.connections; i++) {
    content.connection = i;
    const worker = new Worker(fetchWorkerScript, { workerData: content });
    worker.on("exit", () => onResult());
    worker.on('error', (err) => onError(err, "error in fetch worker "));
}

var waitingForConnectionsToFinish = args.connections;

function onResult() {

    waitingForConnectionsToFinish--;
    
    if (waitingForConnectionsToFinish <= 0) {

        fs.unlink(content.output, (err) => {

            const worker = new Worker(appendWorkerScript, { workerData: content });
            worker.on("exit", () => onMergeComplete(content));
            worker.on("error", (err) => onError(err, "error merging files"));

        });
       
    }
}

function onMergeComplete(content) { 

    const hash = crypto.createHash('md5');
    const inputStream = fs.createReadStream(content.output);

    inputStream.on('readable', () => {

        const data = inputStream.read();        
        if (data)
            hash.update(data);
        else {
            let hashString = hash.digest('hex');
            console.log("output : " + content.output);
            console.log ("with hash : " + hashString);
        }
    });
}

function onError(err, msg) {
    console.log(msg);
    console.log(err.message);
    process.exit();
}
