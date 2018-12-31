const fs = require('fs');
const path = require('path');

module.exports = utils = {};

utils.cleanFiles = function(){
    const directory = './files';
    console.log("Clearing all music files from " + directory);

    fs.readdirSync(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlinkSync(path.join(directory, file), err => {
        if (err) throw err;
        });
    }
    });
}