import api from '../../src/api';
import utils from '../../src/utils';
import {
  ERR_MODULE_DOWNLOAD_ERROR,
  ERR_MODULE_ENABLED,
  ERR_MODULE_NOT_FOUND,
  ERR_MODULE_DISABLED,
  ERR_MODULE_REMOVE_FAILED,
  ERR_MODULE_SEARCH_FAILED,
  ERR_THEME_ALREADY_ACTIVE,
} from '../../src/errors';

jest.mock('child_process');
jest.mock('conf');
jest.mock('download');
jest.mock('fs');
jest.mock('http');
jest.mock('https');
jest.mock('npm-name');
jest.mock('rimraf');

describe('general api', () => {
  it('should get the config', async () => {
    expect(await api.getConfig()).toEqual({});
  });
});

describe('validate', () => {
  it('should check for a valid plugin', async () => {
    require('npm-name').__setAvailable(false);
    expect(await api.checkOnNpm('SHOULD_NOT_EXIST')).toBeFalsy();
  });

  it('should check for an invalid plugin', async () => {
    require('npm-name').__setAvailable(true);
    expect(await api.checkOnNpm('SHOULD_EXIST')).toBeTruthy();
  });
});

describe('plugins', () => {
  const mockResponse = {
    'dist-tags': {
      latest: 'v1.0.0',
    },
    versions: {
      'v1.0.0': {
        dist: {
          tarball: 'http://foobar.com/download.tar.gz',
        },
      },
    },
  };

  require('http').__setMockResponse(JSON.stringify(mockResponse));
  require('npm-name').__setAvailable(true);

  it('should fail to install a plugin on download', async () => {
    require('child_process').__setCode(true);
    try {
      await api.install('SHOULD_EXIST', '/jest/test');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_DOWNLOAD_ERROR);
    }
  });

  it('should install a plugin', async () => {
    require('child_process').__setCode(null);
    await api.install('SHOULD_EXIST', '/jest/test', { debug: true });
    expect(await api.plugins.getAll()).toContain('SHOULD_EXIST');
  });

  it('should install a plugin that is already installed', async () => {
    try {
      await api.install('SHOULD_EXIST', '/jest/test');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_ENABLED);
    }
  });

  it("should install a plugin that doesn't exist", async () => {
    require('npm-name').__setAvailable(false);
    try {
      await api.install('SHOULD_NOT_EXIST', '/jest/test');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_NOT_FOUND);
    }
  });

  it('should fail to install a plugin', async () => {
    require('npm-name').__setAvailable(true);
    const cp = require('child_process');
    cp.__setCode('SHOULD_HAVE_ERRORED');
    cp.__setProcessShouldError(true);
    try {
      await api.startInstall('SHOULD_EXIST', '/jest/test');
    } catch (err) {
      expect(err).toBe('SHOULD_HAVE_ERRORED');
    }
  });

  it('should fail to uninstall a plugin', async () => {
    require('rimraf').__setError(true);
    try {
      await api.uninstall('SHOULD_EXIST', '/jest/test');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_REMOVE_FAILED);
    }
  });

  it('should uninstall a plugin', async () => {
    require('rimraf').__setError(false);
    await api.uninstall('SHOULD_EXIST', '/jest/test');
    expect(await api.plugins.getAll()).not.toContain('SHOULD_EXIST');
  });

  it("should uninstall a plugin that doesn't exist", async () => {
    require('npm-name').__setAvailable(false);
    try {
      await api.uninstall('INVALID_MODULE', '/jest/test');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_DISABLED);
    }
  });
});

describe('symbolic links', () => {
  it('should create a symbolic link', async () => {
    const plugin = 'foobar-plugin';
    const src = '/jest/test';
    expect(await api.createSymLink(plugin, src)).toEqual({
      srcPath: '/jest/test',
      destPath: utils.paths.getPluginPath(plugin),
    });
    expect(await api.plugins.getAll()).toContain('foobar-plugin');
  });

  it('should remove a symbolic link', async () => {
    const plugin = 'foobar-plugin';
    expect(await api.removeSymLink(plugin)).toEqual({
      destPath: utils.paths.getPluginPath(plugin),
    });
    expect(await api.plugins.getAll()).not.toContain('foobar-plugin');
  });
});

describe('themes', () => {
  it('should set a theme', async () => {
    try {
      await api.setTheme('foobar');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_DISABLED);
    }
  });

  it('should set a theme that is already active', async () => {
    try {
      // set the current theme
      await api.setTheme('foobar');
      // attemp to set again
      await api.setTheme('foobar');
    } catch (err) {
      // should throw an error
      expect(err).toBe(ERR_THEME_ALREADY_ACTIVE);
      // current theme is retained
      expect(await api.getTheme()).toBe('foobar');
    }
  });
});

describe('search', () => {
  it('should return some search results', async () => {
    const mockHttpResponse = {
      results: [
        {
          name: ['foobar-default-theme'],
          description: ['Foobar default theme'],
        },
        {
          name: ['foobar-default-plugin'],
          description: ['Foobar default plugin'],
        },
      ],
    };
    require('https').__setMockResponse(JSON.stringify(mockHttpResponse));
    expect(await api.search('foobar')).toContainEqual({
      name: 'foobar-default-theme',
      desc: 'Foobar default theme',
    });

    expect(await api.search('foobar')).not.toContainEqual({
      name: 'invalid-default-theme',
      desc: 'Invalid default theme',
    });
  });

  it('should fail to receive search results', async () => {
    const mockHttpResponse = {
      results: null,
    };
    require('https').__setMockResponse(JSON.stringify(mockHttpResponse));
    try {
      await api.search('foobar');
    } catch (err) {
      expect(err).toBe(ERR_MODULE_SEARCH_FAILED);
    }
  });
});
