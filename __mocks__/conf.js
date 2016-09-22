// Mocks the module "conf"
const path = require('path');

const Conf = class {
  constructor(opts) {
    const o = Object.assign({}, opts);
    o.cwd = '/jest/conf/path';
    this.store = [];
    this.path = path.resolve(o.cwd);
  }

  get(key) {
    return this.store[key];
  }

  set(key, value) {
    this.store[key] = value;
  }
};

module.exports = Conf;
