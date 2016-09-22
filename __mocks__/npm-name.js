// Mocks the module "npm-name"

/**
 * Resolves true if the package name is not fould on npm.
 *
 * @param {String} packageName - The package name to check
 * @return {Promise} - Resolves false if set as "INVALID"
 */
const npmName = packageName => new Promise(resolve => {
  process.nextTick(() => {
    if (packageName === 'INVALID') {
      resolve(false);
      return;
    }
    resolve(true);
  });
});

module.exports = npmName;
