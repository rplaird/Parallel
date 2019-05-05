/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef */

/**
 * Module dependencies.
 */
const argsHelper = require('./helpers/args');
const filesHelper = require('./helpers/files');
const { Worker } = require("worker_threads");
const path = require("path");
const fs = require('fs');

/**
 * Scripts for thread_workers.
 */
const fetchWorkerScript = path.join(__dirname, "./workers/fetch_worker.js");
const appendWorkerScript = path.join(__dirname, "./workers/append_worker.js");

/**
 * Load program arguments.
 */
let args = argsHelper.getArgs();

/**
 * Validate args and assign defaults.
 */
if (!argsHelper.validateArgs(args)) {
    args.help();
}

/**
 * Load only the relevant args into local object.
 */
var content = {
    connections: args.connections,
    url: args.url,
    chunksize: args.chunksize,
    output: args.output
}

console.log('fetching  %s in %i sized chunks with %i connections',
    args.url,
    args.chunksize,
    args.connections);

/**
 * For each connection, create a new worker thread
 * and pass in the content object.
 */   
for (var i = 0; i < args.connections; i++) {
    // Add unique connection 'id' (i) to to content object.
    content.connection = i;
    // Create a new worker to fetch a byte range and save as an individual file.
    const worker = new Worker(fetchWorkerScript, { workerData: content });
    // Exit is automatically called when the worker is finished.
    worker.on("exit", (code) => onResult(code));
    // Error is called on all errors within the worker.
    worker.on('error', (err) => onError(err, "error in fetch worker "));
}

// Init var to number of workers started.
var waitingForConnectionsToFinish = args.connections;

/**
 * Called by each worker when done.
 * Decrement the waitingForConnectionsToFinish variable.
 * When all workers complete, append all individual files
 * into one single file.
 */  
function onResult(code) {
    waitingForConnectionsToFinish--;
    // Have all the workers exited?
    if (waitingForConnectionsToFinish <= 0) {
        // Delete any previous merged files.
        fs.unlink(content.output, (err) => {
            //Create a worker to concatenate all the individual files into one.
            const worker = new Worker(appendWorkerScript, { workerData: content });
            worker.on("exit", (code) => onAppendComplete(content,code));
            worker.on("error", (err) => onError(err, "error merging files"));
        });
    }
}

/**
 * Called when appendWorkerScript worker exits.
 */  
function onAppendComplete(content,code) {
    // show user the filename on disk.
    console.log("Output saved as : " + content.output);
    // generate and display a hash of the merged file.
    filesHelper.getHash(content.output, (hash) => {
        console.log("File hash : " + hash);
    });
}

/**
 * Called when a worker throws an error.
 * todo: ideally we could add retries here.
 * for now just exit.
 */  
function onError(err, msg) {
    console.log(msg);
    console.log(err.message);
    process.exit();
}
