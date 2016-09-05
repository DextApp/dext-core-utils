const fs = require('fs');
const { spawn } = require('child_process');
const rimraf = require('rimraf');
const npmName = require('npm-name');
const {
  ERR_MODULE_NOT_FOUND,
  ERR_MODULE_INSTALLED,
  ERR_MODULE_NOT_INSTALLED,
  ERR_THEME_ALREADY_ACTIVE,
} = require('../errors');
const Conf = require('../utils/conf');
const { downloadPackage } = require('../utils/download');
const { getPluginPath } = require('../utils/paths');

const config = new Conf();

/**
 * Checks if the plugin/package exists on npm
 *
 * @param {String} plugin - The name of the plugin/package
 * @return {Promise} - Throws an error if the plugin/package doesn't exist
 */
const checkOnNpm = plugin => new Promise(resolve => {
  npmName(plugin).then(available => {
    if (available) {
      throw new Error(ERR_MODULE_NOT_FOUND);
    }
    resolve();
  });
});

/**
 * Installs a plugin/package and saves it to the given directory
 *
 * @param {String} plugin - The name of the plugin/package
 * @param {String} outputDir - The directory to install the plugin/package
 * @return {Promise}
 */
const install = (plugin, outputDir) => new Promise(resolve => {
  const plugins = config.get('plugins') || [];

  if (plugins.indexOf(plugin) > -1) {
    throw new Error(ERR_MODULE_INSTALLED);
  }

  checkOnNpm(plugin).then(() => {
    // download, install, and update configs
    downloadPackage(plugin, outputDir).then(output => {
      const installProcess = spawn('npm', ['install', '--prefix', output]);
      installProcess.on('close', (code) => {
        if (!code) {
          plugins.push(plugin);
          config.set('plugins', plugins);
          resolve();
        }
      });
    });
  });
});

/**
 * Uninstalls a plugin/package from the given source directory
 *
 * @param {String} plugin - The name of the plugin/package
 * @param {String} srcDir - The source directory of the plugin/package
 * @return {Promise}
 */
const uninstall = (plugin, srcDir) => new Promise(resolve => {
  const plugins = config.get('plugins') || [];

  if (!plugins || !plugins.length) {
    throw new Error(ERR_MODULE_NOT_INSTALLED);
  }

  if (plugins.indexOf(plugin) === -1) {
    throw new Error(ERR_MODULE_NOT_INSTALLED);
  }

  // removes the directory
  const pluginDir = srcDir;
  rimraf(pluginDir, err => {
    if (err) {
      throw new Error(err);
    }
    plugins.splice(plugins.indexOf(plugin), 1);
    config.set('plugins', plugins);
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
const createSymLink = (plugin, src) => new Promise(resolve => {
  const dest = getPluginPath(plugin);
  fs.link(src, dest, () => {
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
const removeSymLink = plugin => new Promise(resolve => {
  const dest = getPluginPath(plugin);
  fs.unlink(dest, () => {
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
const setTheme = theme => new Promise(resolve => {
  const currentTheme = config.get('theme');
  const plugins = config.get('plugins') || [];

  if (currentTheme === theme) {
    throw new Error(ERR_THEME_ALREADY_ACTIVE);
  }

  if (!plugins || !plugins.length) {
    throw new Error(ERR_MODULE_NOT_INSTALLED);
  }

  if (plugins.indexOf(theme) === -1) {
    throw new Error(ERR_MODULE_NOT_INSTALLED);
  }

  config.set('theme', theme);

  resolve();
});

/**
 * Retrieve the current theme
 *
 * @return {String} - The current name of the theme
 */
const getTheme = () => new Promise(resolve => {
  const currentTheme = config.get('theme');
  resolve(currentTheme || '');
});

/**
 * Retrieve the current config
 *
 * @return {Object} - The current configuration
 */
const getConfig = () => new Promise(resolve => {
  resolve(config.store);
});

module.exports = {
  checkOnNpm,
  install,
  uninstall,
  createSymLink,
  removeSymLink,
  setTheme,
  getTheme,
  getConfig,
};
