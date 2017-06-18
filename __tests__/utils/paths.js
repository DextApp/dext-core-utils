import path from 'path';
import paths from '../../src/utils/paths';

describe('paths', () => {
    it('should retrieve the plugin path', () => {
        const pluginName = 'foobar';
        const pluginPath = paths.PLUGIN_PATH;
        expect(paths.getPluginPath(pluginName)).toEqual(
            path.resolve(pluginPath, pluginName)
        );
    });
});
