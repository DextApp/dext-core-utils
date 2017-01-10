const os = require('os');
const path = require('path');

exports.USER_PATH = os.homedir();
exports.DEXT_PATH = path.resolve(exports.USER_PATH, '.dext');
exports.THEME_PATH = path.resolve(exports.DEXT_PATH, 'plugins');
exports.PLUGIN_PATH = path.resolve(exports.DEXT_PATH, 'plugins');

/**
 * Retrieve the path to the plugin
 *
 * @param {String} plugin - The name of the plugin/package
 * @return {String}
 */
exports.getPluginPath = plugin => path.resolve(exports.PLUGIN_PATH, plugin);
