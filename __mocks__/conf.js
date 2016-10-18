// Mocks the module "conf"
const path = require('path');

let cwdMock = '';

const Conf = class {
  constructor(opts) {
    const o = Object.assign({}, opts);
    o.cwd = cwdMock;
    this.store = {};
    this.path = path.resolve(o.cwd);
  }

  get(key) {
    return this.store[key];
  }

  set(key, value) {
    this.store[key] = value;
  }
};

Conf.__setCwd = (cwd) => {
  cwdMock = cwd;
};

module.exports = Conf;
