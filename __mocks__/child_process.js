import EventEmitter from 'events';

const cp = jest.genMockFromModule('child_process');

const MockChildProcess = class extends EventEmitter {};

// create a mock process and return code
let mockCode = null;
let processShouldError = false;

/**
 * Sets the mock code
 *
 * @param {String} code
 */
const __setCode = (code) => {
  mockCode = code;
};

/**
 * Set to true if the process should send an error message.
 *
 * @param {Boolean} flag
 */
const __setProcessShouldError = (flag) => {
  processShouldError = flag;
};

/**
 * Mock function to override child_process.spawn
 *
 * @param {String} command
 * @param {Array} args
 * @param {Object} options
 */
// eslint-disable-next-line no-unused-vars
const spawn = (command, args, options) => {
  const mockProcess = new MockChildProcess();
  process.nextTick(() => {
    if (processShouldError) {
      mockProcess.emit('error', mockCode);
    } else {
      mockProcess.emit('close', mockCode);
    }
  });
  return mockProcess;
};

cp.__setCode = __setCode;
cp.__setProcessShouldError = __setProcessShouldError;
cp.spawn = spawn;

module.exports = cp;
