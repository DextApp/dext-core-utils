// create a mock error
let mockAvailable = false;

/**
 * Sets the mock available flag
 *
 * @param {Boolean} available
 */
const __setAvailable = (available) => {
  mockAvailable = available;
};

/**
 * Mocks the npm-name package.
 *
 * @param {String} plugin - The package name to check
 * @return {Promise} - Resolve true if the pacakge should not exist
 */
// eslint-disable-next-line no-unused-vars
const npmName = plugin => new Promise((resolve) => {
  process.nextTick(() => {
    if (mockAvailable) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
});

npmName.__setAvailable = __setAvailable;

module.exports = npmName;
