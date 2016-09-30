import EventEmitter from 'events';

const http = jest.genMockFromModule('http');

const MockServerResponse = class extends EventEmitter {};

// create a mock response and data object
let mockData = null;

/**
 * Sets the mock response
 *
 * @param {String} data
 */
// eslint-disable-next-line no-underscore-dangle
const __setMockResponse = (data) => {
  mockData = data;
};

/**
 * Mock function to override http.get
 *
 * @param {String} url
 * @param {Function} callback
 */
const get = (url, callback) => {
  const mockResponse = new MockServerResponse();
  process.nextTick(() => { mockResponse.emit('data', mockData); });
  process.nextTick(() => { mockResponse.emit('end'); });
  callback.call(null, mockResponse);
};

// eslint-disable-next-line no-underscore-dangle
http.__setMockResponse = __setMockResponse;
http.get = get;

module.exports = http;
