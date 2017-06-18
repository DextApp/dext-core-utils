import download from '../../src/utils/download';

jest.mock('http');

describe('download', () => {
    it('should download the package', async () => {
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
        const pkg = 'foobar';
        const outputDir = '/path/to/output';
        expect(await download.downloadPackage(pkg, outputDir)).toEqual(
            '/path/to/output'
        );
    });

    it('should strip the file path', () => {
        const file = { path: 'package/foobar' };
        expect(download.stripPackageDirectory(file)).toEqual({
            path: '/foobar',
        });
    });

    it('should retrieve the package url', () => {
        const pkg = 'foobar';
        expect(download.getPackageUrl(pkg)).toEqual(
            'http://registry.npmjs.org/foobar'
        );
    });
});
