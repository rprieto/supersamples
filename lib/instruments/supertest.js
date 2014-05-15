var _       = require('lodash');
var capture = require('../capture');


exports.assert = function(response, fn) {
  capture.add({
    request: extractRequest(this),
    response: extractResponse(this, response)
  });
  this.__shimmed.assert.call(this, response, fn);
};

// These headers are set on every request
// But not very useful in the documentation
var requestHeaderBlacklist = [
  'host',
  'accept-encoding'
];

function extractRequest(superTest) {
  var fields = {
    headers: requestHeaders(superTest.req),
    method: superTest.req.method,
    path: superTest.req.path
  };
  if (superTest._data) {
    fields.data = superTest._data;
  }
  return fields;
}

function extractResponse(superTest, response) {
  return {
    status: response.status,
    headers: responseHeaders(superTest, response),
    body: superTest.res.body || superTest.res.text
  };
}

function requestHeaders(superTest) {
  return _.omit(superTest._headers, function(value, key) {
    var excluded = requestHeaderBlacklist.indexOf(key) !== -1;
    return excluded || (!value);
  });
}

function responseHeaders(superTest, response) {
  // only show response headers that were asserted on
  var names = Object.keys(superTest._fields).map(function(s) { return s.toLowerCase() });
  return _.pick(response.headers, function(value, key) {
    return names.indexOf(key.toLowerCase()) !== -1;
  });
}
