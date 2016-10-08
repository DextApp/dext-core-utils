const Conf = require('../utils/conf');

// initialize a new config file
const config = new Conf();

const getAll = () => config.get('plugins') || [];

/**
 * Checks if the plugin is already installed
 *
 * @param {String} plugin - The plugin name
 * @return {Boolean}
 */
const isInstalled = plugin => getAll().indexOf(plugin) > -1;

/**
 * Adds the plugin to the config
 *
 * @param {String} plugin - The plugin name
 */
const add = (plugin) => {
  const plugins = getAll();
  plugins.push(plugin);
  config.set('plugins', plugins);
};

/**
 * Removes the plugin from the config
 *
 * @param {String} plugin - The plugin name
 */
const remove = (plugin) => {
  const plugins = getAll();
  plugins.splice(plugins.indexOf(plugin), 1);
  config.set('plugins', plugins);
};

module.exports = {
  getAll,
  isInstalled,
  add,
  remove,
};
