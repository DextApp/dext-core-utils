import path from 'path';
import Conf from '../../src/utils/conf';

describe('conf', () => {
  it('should create a new Conf file', () => {
    Conf.__setCwd(path.resolve('/', 'jest', 'conf', 'path'));
    expect(new Conf().path).toEqual(path.resolve('/', 'jest', 'conf', 'path'));
  });
});
