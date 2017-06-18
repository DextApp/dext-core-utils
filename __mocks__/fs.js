const fs = jest.genMockFromModule('fs');

let _error = null;
let _files = [];

/**
 * Set files
 *
 * @param {String[]}
 */
fs.__setFiles = files => {
    _files = files;
};

/**
 * Set a return error if necessary
 *
 * @param {String}
 */
fs.__setError = error => {
    _error = error;
};

// Mocks fs.link
fs.link = (src, dest, callback) => {
    callback.call(null);
};

// Mocks fs.unlink
fs.unlink = (dest, callback) => {
    callback.call(null);
};

/**
 * Returns true if the file path exists in the _files list
 *
 * @param {String} filePath
 * @return {Boolean}
 */
fs.existsSync = filePath => _files.indexOf(filePath) > -1;

/**
 * Reads the directory and apply the callback
 * with the mocked values
 *
 * @param {String} directory
 * @param {Function} callback
 */
fs.readdir = (directory, callback) => {
    if (_error) {
        callback.call(null, _error);
    } else {
        callback.call(null, null, _files);
    }
};

module.exports = fs;
