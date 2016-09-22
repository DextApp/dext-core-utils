import Conf from '../../src/utils/conf';

describe('conf', () => {
  it('should create a new Conf file', () => {
    expect(new Conf().path).toEqual('/jest/conf/path');
  });
});
