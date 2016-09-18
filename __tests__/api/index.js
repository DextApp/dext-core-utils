import api from '../../src/api';

describe('api', () => {
  it('should should check for a valid plugin', async () => {
    expect(await api.checkOnNpm('foobar')).toBeFalsy();
  });

  it('should should check for an invalid plugin', async () => {
    expect(await api.checkOnNpm('INVALID')).toBeTruthy();
  });
});
