import EventEmitter from 'events';

const cp = jest.genMockFromModule('child_process');

const MockChildProcess = class extends EventEmitter {};

// create a mock process and return code
let mockCode = null;

/**
 * Sets the mock code
 *
 * @param {String} code
 */
const __setCode = (code) => {
  mockCode = code;
};

/**
 * Mock function to override child_process.spawn
 *
 * @param {String} command
 * @param {Array} args
 */
// eslint-disable-next-line no-unused-vars
const spawn = (command, args) => {
  const mockProcess = new MockChildProcess();
  process.nextTick(() => { mockProcess.emit('close', mockCode); });
  return mockProcess;
};

cp.__setCode = __setCode;
cp.spawn = spawn;

module.exports = cp;
