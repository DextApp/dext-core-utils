const fs = require('fs');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const npmName = require('npm-name');
const {
  ERR_MODULE_DOWNLOAD_ERROR,
  ERR_MODULE_ENABLED,
  ERR_MODULE_NOT_FOUND,
  ERR_MODULE_DISABLED,
  ERR_MODULE_REMOVE_FAILED,
  ERR_MODULE_SEARCH_FAILED,
  ERR_THEME_ALREADY_ACTIVE,
} = require('../errors');
const Conf = require('../utils/conf');
const plugins = require('./plugins');
const { downloadPackage } = require('../utils/download');
const { getPluginPath } = require('../utils/paths');
const { searchPackages } = require('../utils/search');

const config = new Conf();

/**
  * Lists plugins & themes with the keyword 'dext-plugin' or 'dext-theme' on npm
  *
  * @param {String} plugin - The name of the plugin/theme
  * @return {Promise} - Resolves the search results
  */
const search = searchTerm => new Promise((resolve, reject) => {
  searchPackages(searchTerm).then((packages) => {
    if (!Array.isArray(packages) || !packages.length) {
      reject(ERR_MODULE_SEARCH_FAILED);
      return;
    }

    resolve(packages);
  });
});

/**
 * Checks if the plugin/package exists on npm
 *
 * @param {String} plugin - The name of the plugin/package
 * @return {Promise} - Resolves true if the plugin is found on npm
 */
const checkOnNpm = plugin => new Promise((resolve) => {
  npmName(plugin).then(notFound => resolve(!notFound));
});

/**
 * Starts the installation process:
 *
 * - check on npm
 * - download package
 * - run npm install in downloaded directory
 *
 * @private
 * @param {String} plugin - The name of the plugin/package
 * @param {String} outputDir - The directory to install the plugin/package
 * @param {Object} options - Optional options
 * @return {Promise}
 */
const startInstall = (plugin, outputDir, options) => new Promise((resolve, reject) => {
  checkOnNpm(plugin).then((found) => {
    // if the plugin is not found
    if (!found) {
      reject(ERR_MODULE_NOT_FOUND);
      return;
    }
    // download, install, and update configs
    downloadPackage(plugin, outputDir).then((output) => {
      const installOptions = {
        stdio: 'ignore',
      };
      if (options && options.debug) {
        installOptions.stdio = 'inherit';
      }
      const installProcess = spawn('npm', ['install', '--prefix', output], installOptions);
      installProcess
        .on('error', (err) => {
          reject(err);
          return;
        })
        .on('close', (code) => {
          if (code) {
            reject(ERR_MODULE_DOWNLOAD_ERROR);
            return;
          }
          // enable the plugin
          plugins.add(plugin);
          plugins.enable(plugin);
          resolve();
        });
    });
  });
});

/**
 * Installs and enabled a plugin/package and saves it to the given directory
 *
 * @param {String} plugin - The name of the plugin/package
 * @param {String} outputDir - The directory to install the plugin/package
 * @param {Object} options - Optional options
 * @return {Promise}
 */
const install = (plugin, outputDir, options) => new Promise((resolve, reject) => {
  if (plugins.isEnabled(plugin)) {
    reject(ERR_MODULE_ENABLED);
    return;
  }
  startInstall(plugin, outputDir, options)
    .then(resolve)
    .catch(reject);
});

/**
 * Uninstalls a plugin/package from the given source directory
 *
 * @param {String} plugin - The name of the plugin/package
 * @param {String} srcDir - The source directory of the plugin/package
 * @return {Promise}
 */
const uninstall = (plugin, srcDir) => new Promise((resolve, reject) => {
  if (!plugins.isEnabled(plugin)) {
    reject(ERR_MODULE_DISABLED);
    return;
  }

  // removes the directory
  const pluginDir = srcDir;
  rimraf(pluginDir, (err) => {
    // if there's an error trying to remove the plugin
    if (err) {
      reject(ERR_MODULE_REMOVE_FAILED);
      return;
    }
    // disable the plugin
    plugins.remove(plugin);
    resolve();
  });
});

/**
 * Creates a symlink for the current directory to the Dext plugin directory
 *
 * @param {String} plugin - The name of the plugin/package
 * @param {String} src - The source directory to link
 * @return {Promise} - An object shape with { srcPath, destPath }
 */
const createSymLink = (plugin, src) => new Promise((resolve) => {
  const dest = getPluginPath(plugin);
  fs.link(src, dest, () => {
    plugins.enable(plugin);
    resolve({
      srcPath: src,
      destPath: dest,
    });
  });
});

/**
 * Removes symlink for the given plugin
 *
 * @param {String} src - The source directory to link
 * @param {String} plugin - The name of the plugin/package
 * @return {Promise} - An object shape with { destPath }
 */
const removeSymLink = plugin => new Promise((resolve) => {
  const dest = getPluginPath(plugin);
  fs.unlink(dest, () => {
    plugins.remove(plugin);
    resolve({
      destPath: dest,
    });
  });
});

/**
 * Switches your current theme
 *
 * @param {String} theme - The name of the theme
 * @return {Promise}
 */
const setTheme = theme => new Promise((resolve, reject) => {
  const currentTheme = config.get('theme');

  // if theme is currently active
  if (currentTheme === theme) {
    reject(ERR_THEME_ALREADY_ACTIVE);
  }

  // if theme plugin is disabled
  if (!plugins.isEnabled(theme)) {
    reject(ERR_MODULE_DISABLED);
  }

  config.set('theme', theme);

  resolve();
});

/**
 * Retrieve the current theme
 *
 * @return {String} - The current name of the theme
 */
const getTheme = () => new Promise((resolve) => {
  const currentTheme = config.get('theme') || '';
  resolve(currentTheme);
});

/**
 * Retrieve the current config
 *
 * @return {Object} - The current configuration
 */
const getConfig = () => new Promise((resolve) => {
  resolve(config.store);
});

module.exports = {
  checkOnNpm,
  install,
  startInstall,
  uninstall,
  createSymLink,
  removeSymLink,
  search,
  setTheme,
  getTheme,
  getConfig,
  plugins,
};
