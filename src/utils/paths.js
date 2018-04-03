const os = require('os');
const path = require('path');

exports.USER_PATH = os.homedir();
exports.DEXT_PATH = path.resolve(exports.USER_PATH, '.dext');
exports.THEME_PATH = path.resolve(exports.DEXT_PATH, 'themes');
exports.PLUGIN_PATH = path.resolve(exports.DEXT_PATH, 'plugins');

/**
 * @param {String} plugin - The name of the plugin/package
 * @return {String}
 */
exports.getPluginPath = plugin => path.resolve(exports.PLUGIN_PATH, plugin);

/**
 * @param {String} theme - The name of the theme/package
 * @return {String}
 */
exports.getThemePath = theme => path.resolve(exports.THEME_PATH, theme);
