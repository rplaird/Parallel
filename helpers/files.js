/**
 * Module dependencies.
 */
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
    // Generate and return an md5 for the specified file.
    getHash: function (filename, callback) {
        const hash = crypto.createHash('md5');
        const inputStream = fs.createReadStream(filename);

        inputStream.on('readable', () => {
            const data = inputStream.read();
            if (data) hash.update(data);
            else {
                let hashString = hash.digest('hex');
                callback(hashString);
            }
        });
    }
};