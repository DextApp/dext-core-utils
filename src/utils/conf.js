const Conf = require('conf');
const { DEXT_PATH } = require('./paths');

export default class extends Conf {
    constructor(opts) {
        const defaultOpts = {
            defaults: {
                theme: '',
                plugins: [],
            },
        };
        const o = Object.assign({}, opts, defaultOpts);
        o.cwd = DEXT_PATH;
        super(o);
    }
}
