// create a mock error
let mockError = null;


/**
 * Sets the mock error
 *
 * @param {String} data
 */
const __setError = (error) => {
  mockError = error;
};

/**
 * Mocks the rimraf package
 *
 * @param {String} dir
 * @param {Function} callback
 */
const rimraf = (dir, callback) => {
  callback.call(null, mockError);
};

rimraf.__setError = __setError;

module.exports = rimraf;
