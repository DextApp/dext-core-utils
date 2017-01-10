const fs = jest.genMockFromModule('fs');

let _files = [];

/**
 * Set files
 *
 * @param {String[]}
 */
fs.__setFiles = (files) => {
  _files = files;
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

module.exports = fs;
