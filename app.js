const argsHelper = require('./helpers/args');
const { Worker } = require("worker_threads");
const path = require("path");

const fetchWorkerScript = path.join(__dirname, "./workers/fetch_worker.js");
const appendWorkerScript = path.join(__dirname, "./workers/append_worker.js");

args = argsHelper.getArgs();

if ( !argsHelper.validateArgs(args)){
    args.help();
}

var content = {
    connections: args.connections,
    url: args.url,
    chunksize: args.chunksize,
    output: args.output
}

var waitingForConnectionsToFinish = args.connections;

console.log('fetching  %s in %i sized chunks with %i connections', args.url, args.chunksize, args.connections);

for (var i = 0; i < args.connections; i++) {
    content.connection = i;
    const worker = new Worker(fetchWorkerScript, { workerData: content });
    worker.on("exit", () => onResult());
}

function onResult() {
    waitingForConnectionsToFinish--;
    if (waitingForConnectionsToFinish <= 0) {
        const worker = new Worker(appendWorkerScript, { workerData: content });
        worker.on("exit", () => console.log('done'));
    }
}
