const os = require('os');
const path = require('path');

const USER_PATH = os.homedir();
const DEXT_PATH = path.resolve(USER_PATH, '.dext');
const THEME_PATH = path.resolve(DEXT_PATH, 'plugins');
const PLUGIN_PATH = path.resolve(exports.DEXT_PATH, 'plugins');

/**
 * Retrieve the path to the plugin
 *
 * @param {String} plugin - The name of the plugin/package
 * @return {String}
 */
const getPluginPath = plugin => path.resolve(exports.PLUGIN_PATH, plugin);

export { USER_PATH, DEXT_PATH, THEME_PATH, PLUGIN_PATH, getPluginPath };
