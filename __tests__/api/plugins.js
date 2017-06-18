import path from 'path';
import plugins from '../../src/api/plugins';
import { PLUGIN_PATH } from '../../src/utils/paths';

jest.mock('fs');

describe('plugins', () => {
    it('should retrieve all plugins from the file system', async () => {
        require('fs').__setFiles([
            `${PLUGIN_PATH}/foo-plugin`,
            `${PLUGIN_PATH}/bar-plugin`,
            `${PLUGIN_PATH}/baz-plugin`,
        ]);
        expect(await plugins.fetchPlugins()).toEqual([
            `${PLUGIN_PATH}/foo-plugin`,
            `${PLUGIN_PATH}/bar-plugin`,
            `${PLUGIN_PATH}/baz-plugin`,
        ]);
    });

    it('should return no plugins', async () => {
        require('fs').__setError('NO_PLUGINS_FOUND');
        try {
            await plugins.fetchPlugins();
        } catch (err) {
            expect(err).toEqual('NO_PLUGINS_FOUND');
        }
    });

    it('should check if a plugin is installed', () => {
        // eslint-disable-next-line global-require
        require('fs').__setFiles([path.resolve(PLUGIN_PATH, 'foobar')]);
        expect(plugins.isInstalled('foobar')).toBeTruthy();
        expect(plugins.isInstalled('bazqux')).toBeFalsy();
    });
});
