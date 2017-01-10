import path from 'path';
import plugins from '../../src/api/plugins';
import { PLUGIN_PATH } from '../../src/utils/paths';

jest.mock('fs');

describe('plugins', () => {
  it('should check if a plugin is installed', () => {
    // eslint-disable-next-line global-require
    require('fs').__setFiles([
      path.resolve(PLUGIN_PATH, 'foobar'),
    ]);
    expect(plugins.isInstalled('foobar')).toBeTruthy();
    expect(plugins.isInstalled('bazqux')).toBeFalsy();
  });
});
