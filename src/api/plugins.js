const Conf = require('../utils/conf');

// initialize a new config file
const config = new Conf();

const getAll = () => config.get('plugins') || [];

/**
 * Checks if the plugin is already enabled
 *
 * @param {String} plugin - The plugin name
 * @return {Boolean}
 */
const isEnabled = plugin => getAll().indexOf(plugin) > -1;

/**
 * Enables the plugin by adding it to the config
 *
 * @param {String} plugin - The plugin name
 */
const enable = (plugin) => {
  const plugins = getAll();
  plugins.push(plugin);
  config.set('plugins', plugins);
};

/**
 * Disables the plugin by removing it from the config
 *
 * @param {String} plugin - The plugin name
 */
const disable = (plugin) => {
  const plugins = getAll();
  plugins.splice(plugins.indexOf(plugin), 1);
  config.set('plugins', plugins);
};

module.exports = {
  getAll,
  isEnabled,
  enable,
  disable,
};
