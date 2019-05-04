var args = require('commander');

module.exports = {
    getArgs: function () {
        args
            .version('0.1.0')
            .option('-u, --url [url]', 'file url')
            .option('-c, --connections [n]', 'number of connections', parseInt)
            .option('-C, -chunksize [n]', 'size in bytes', parseInt)
            .parse(process.argv);
        return args
    }
  };