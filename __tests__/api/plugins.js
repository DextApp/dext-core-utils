import path from 'path';
import plugins from '../../src/api/plugins';
import { PLUGIN_PATH } from '../../src/utils/paths';

jest.mock('fs');

describe('plugins', () => {
  it('should retrieve all plugins from the file system', async () => {
    require('fs').__setFiles([
      '/dext/plugins/foo-plugin',
      '/dext/plugins/bar-plugin',
      '/dext/plugins/baz-plugin',
    ]);
    expect(await plugins.getAllPlugins())
      .toEqual([
        '/dext/plugins/foo-plugin',
        '/dext/plugins/bar-plugin',
        '/dext/plugins/baz-plugin',
      ]);
  });

  it('should return no plugins', async () => {
    require('fs').__setError('NO_PLUGINS_FOUND');
    try {
      await plugins.getAllPlugins();
    } catch (err) {
      expect(err)
        .toEqual('NO_PLUGINS_FOUND');
    }
  });

  it('should check if a plugin is installed', () => {
    // eslint-disable-next-line global-require
    require('fs').__setFiles([
      path.resolve(PLUGIN_PATH, 'foobar'),
    ]);
    expect(plugins.isInstalled('foobar')).toBeTruthy();
    expect(plugins.isInstalled('bazqux')).toBeFalsy();
  });
});
