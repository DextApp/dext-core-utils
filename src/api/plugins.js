const path = require('path');
const fs = require('fs');
const Conf = require('../utils/conf');
const { PLUGIN_PATH } = require('../utils/paths');

// initialize a new config file
const config = new Conf();

const getAll = () => config.get('plugins') || [];
const getAllEnabled = () => config.get('enabledPlugins') || [];

/**
 * Checks if the plugin is already enabled
 *
 * @param {String} plugin - The plugin name
 * @return {Boolean}
 */
// eslint-disable-next-line no-bitwise
const isEnabled = plugin => ~getAllEnabled().indexOf(plugin);

/**
 * Checks if the plugin is installed
 *
 * @param {String} plugin - The plugin name
 * @return {Boolean}
 */
const isInstalled = plugin => fs.existsSync(path.resolve(PLUGIN_PATH, plugin));

/*
 * adds newly installed plugin to the config (doesn't enable or disable it)
 * 
 * @param {String} plugin - plugin name
*/
const add = (plugin) => {
  const plugins = getAll();
  if(plugins.indexOf(plugin) == -1){
    plugins.push(plugin);
  }
  config.set('plugins', plugins);
}

/**
 * Enables the plugin by adding it to the config
 *
 * @param {String} plugin - The plugin name
 */
const enable = (plugin) => {
  const plugins = getAll();
  if(plugins.indexOf(plugin) == -1){
    add(plugin);
  }

  const enabled = getAllEnabled();

  enabled.push(plugin);
  config.set('enabledPlugins', enabled);
};

/**
 * Disables the plugin by removing it from the config
 *
 * @param {String} plugin - The plugin name
 */
const disable = (plugin) => {
  const plugins = getAllEnabled();
  plugins.splice(plugins.indexOf(plugin), 1);
  config.set('enabledPlugins', plugins);
};

/**
 * Removes the plugin from both plugin config arrays
 *
 * @param {String} plugin - plugin name 
*/
const remove = (plugin) => {
  disable(plugin);
  plugins = getAll();
  plugins.splice(plugins.indexOf(plugin), 1);
  config.set('plugins', plugins);
}

module.exports = {
  getAll,
  getAllEnabled,
  isEnabled,
  isInstalled,
  enable,
  disable,
  remove
};
