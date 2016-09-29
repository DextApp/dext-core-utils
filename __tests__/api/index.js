import api from '../../src/api';
import utils from '../../src/utils';
import {
  ERR_THEME_ALREADY_ACTIVE,
  ERR_MODULE_NOT_FOUND,
  ERR_MODULE_NOT_INSTALLED,
} from '../../src/errors';

jest.mock('conf');
jest.mock('download');
jest.mock('fs');
jest.mock('npm-name');

describe('api', () => {
  it('should check for a valid plugin', async () => {
    expect(await api.checkOnNpm('SHOULD_NOT_EXIST')).toBeFalsy();
  });

  it('should check for an invalid plugin', async () => {
    expect(await api.checkOnNpm('SHOULD_EXIST')).toBeTruthy();
  });

  it('should install a plugin that doesn\'t exist', async () => {
    try {
      await api.install('SHOULD_NOT_EXIST', '/jest/test');
    } catch (err) {
      expect(err).toEqual(ERR_MODULE_NOT_FOUND);
    }
  });

  it('should uninstall a plugin that doesn\'t exist', async () => {
    try {
      await api.uninstall('INVALID_MODULE', '/jest/test');
    } catch (err) {
      expect(err).toEqual(ERR_MODULE_NOT_INSTALLED);
    }
  });

  it('should create a symbolic link', async () => {
    const plugin = 'foobar-plugin';
    const src = '/jest/test';
    expect(await api.createSymLink(plugin, src)).toEqual({
      srcPath: '/jest/test',
      destPath: utils.paths.getPluginPath(plugin),
    });
  });

  it('should remove a symbolic link', async () => {
    const plugin = 'foobar-plugin';
    expect(await api.removeSymLink(plugin)).toEqual({
      destPath: utils.paths.getPluginPath(plugin),
    });
  });

  it('should set a theme', async () => {
    try {
      await api.setTheme('foobar');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_NOT_INSTALLED);
    }
  });

  it('should set a theme that is already active', async () => {
    try {
      // set the current theme
      await api.setTheme('foobar');
      await api.setTheme('foobar');
    } catch (err) {
      expect(err).toBe(ERR_THEME_ALREADY_ACTIVE);
      expect(await api.getTheme()).toBe('foobar');
    }
  });

  it('should get the config', async () => {
    expect(await api.getConfig()).toEqual({ theme: 'foobar' });
  });
});
