# Parallel

Nodejs Download Accelerator.

Creates multiple connections to different sections of a single file,
to utilize all available bandwidth.

## Technologies

[commander](https://github.com/tj/commander.js) commandline helper.   
[workers](https://nodejs.org/api/worker_threads.html) nodejs workers.   
[request](https://github.com/request/request) http request library.   

## First time setup
```bash
# >  /parallel$ npm install
```

## Usage
```bash
# >  /parallel$ node app.js --help
# >  /parallel$ node app.js --url http://22222i.imgur.com/z4d4kWk.jpg 
# >  /parallel$ node app.js --url http://22222i.imgur.com/z4d4kWk.jpg --connections 4
# >  /parallel$ node app.js --url http://22222i.imgur.com/z4d4kWk.jpg --chunksize 1048576
# >  /parallel$ node app.js --url http://22222i.imgur.com/z4d4kWk.jpg --output catpic.png
```