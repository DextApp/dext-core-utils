import download from '../../src/utils/download';

describe('download', () => {
  it('should download the package', async () => {
    const pkg = 'foobar';
    const outputDir = '/path/to/output';
    expect(await download.downloadPackage(pkg, outputDir)).toEqual('/path/to/output');
  });

  it('should strip the file path', () => {
    const file = { path: 'package/foobar' };
    expect(download.stripPackageDirectory(file)).toEqual({ path: '/foobar' });
  });

  it('should retrieve the package url', () => {
    const pkg = 'foobar';
    expect(download.getPackageUrl(pkg)).toEqual('http://registry.npmjs.org/foobar');
  });
});
