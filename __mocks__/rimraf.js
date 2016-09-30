// create a mock error
let mockError = null;


/**
 * Sets the mock error
 *
 * @param {String} data
 */
// eslint-disable-next-line no-underscore-dangle
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

// eslint-disable-next-line no-underscore-dangle
rimraf.__setError = __setError;

module.exports = rimraf;
