const argsHelper = require('./helpers/args');
const { Worker } = require("worker_threads");
const path = require("path");

args = argsHelper.getArgs()

if (!args.connections) args.connections = 4


console.log('fetching  %s -  with %i connections', args.url, args.connections);

const fetchWorkerScript = path.join(__dirname, "./workers/fetch_worker.js");
const appendWorkerScript = path.join(__dirname, "./workers/append_worker.js");

var content = {
    connections: args.connections,
    url: args.url,
    chunksize: 50000
}

var waitingForConnectionsToFinish = args.connections;

for (var i = 0; i < args.connections; i++) {
    content.connection = i;
    const worker = new Worker(fetchWorkerScript, { workerData: content });
    worker.on("exit", () => onResult());
}

function onResult() {
    waitingForConnectionsToFinish--;
    if (!waitingForConnectionsToFinish) {
        const worker = new Worker(appendWorkerScript, { workerData: args.connections });
        worker.on("exit", () => console.log('done'));
    }
}
