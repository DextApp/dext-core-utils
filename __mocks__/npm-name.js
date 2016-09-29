// Mocks the module "npm-name"

/**
 * Mocks the npm-name package. This checks to see if a package is
 * avaialble (free package name) on npm.
 *
 * Resolves true if the package should not exist
 * Resolves false if the package should exist (set as "SHOULD_EXIST")
 *
 * @param {String} plugin - The package name to check
 * @return {Promise} - Resolve true if the pacakge should not exists
 */
const npmName = plugin => new Promise((resolve) => {
  process.nextTick(() => {
    if (plugin === 'SHOULD_EXIST') {
      resolve(false);
      return;
    }
    resolve(true);
  });
});

module.exports = npmName;
