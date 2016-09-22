import api from '../../src/api'; // eslint-disable-line import/imports-first
import { ERR_MODULE_NOT_INSTALLED } from '../../src/errors'; // eslint-disable-line import/imports-first

describe('api', () => {
  it('should should check for a valid plugin', async () => {
    expect(await api.checkOnNpm('foobar')).toBeFalsy();
  });

  it('should should check for an invalid plugin', async () => {
    expect(await api.checkOnNpm('INVALID')).toBeTruthy();
  });

  it('should set a theme', async () => {
    try {
      await api.setTheme('foobar');
    } catch (err) {
      expect(err.toString()).toEqual(`Error: ${ERR_MODULE_NOT_INSTALLED}`);
    }
  });

  it('should get a theme', async () => {
    expect(await api.getTheme()).toEqual('');
  });

  it('should get the config', async () => {
    expect(await api.getConfig()).toEqual([]);
  });
});
