var args = require('commander');

module.exports = {
    getArgs: function () {
        args
            .version('0.1.0')
            .option('-c, --connections [n]', 'number of connections', parseInt)
            .option('-u, --url [url]', 'file url')
            .parse(process.argv);
        return args
    }
  };