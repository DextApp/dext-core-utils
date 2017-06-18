import EventEmitter from 'events';

const https = jest.genMockFromModule('https');

const MockServerResponse = class extends EventEmitter {};

// create a mock response and data object
let mockData = null;

/**
 * Sets the mock response
 *
 * @param {String} data
 */
const __setMockResponse = data => {
    mockData = data;
};

/**
 * Mock function to override https.get
 *
 * @param {String} url
 * @param {Function} callback
 */
const get = (url, callback) => {
    const mockResponse = new MockServerResponse();
    process.nextTick(() => {
        mockResponse.emit('data', mockData);
    });
    process.nextTick(() => {
        mockResponse.emit('end');
    });
    callback.call(null, mockResponse);
};

https.__setMockResponse = __setMockResponse;
https.get = get;

module.exports = https;
