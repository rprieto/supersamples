var _       = require('lodash');
var capture = require('../capture');


exports.expect = function(a, b) {
  typeOfA = typeof a;
  if (typeOfA != 'function' && typeOfA != 'number') {
    typeOfB = typeof b;
    if (typeOfB == 'string' || typeOfB == 'number' || b instanceof RegExp) {
      if (!this._expectedHeaders) {
        this._expectedHeaders = [];
      }
      this._expectedHeaders.push('' + a);
    }
  }
  return this.__shimmed.expect.apply(this, arguments);
};

exports.assert = function(/*[error,] response, fn*/) {
  var response;
  if (this.__shimmed.assert.length < 3) {
    response = arguments[0];
  } else {
    response = arguments[1];
  }

  var request = extractRequest(this);

  if (request) {
    capture.add({
      request: request,
      response: extractResponse(this, response)
    });
  }
  return this.__shimmed.assert.apply(this, arguments);
};

// These headers are set on every request
// But not very useful in the documentation
var requestHeaderBlacklist = [
  'host',
  'accept-encoding',
  'user-agent',
  'supersamplesignore'
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
  if (superTest.req._headers.supersamplesignore === 'true') {
    return null;
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
  if (superTest._expectedHeaders) {
    var names = superTest._expectedHeaders.map(function(s) { return s.toLowerCase() });
    return _.pick(response.headers, function(value, key) {
      return names.indexOf(key.toLowerCase()) !== -1;
    });
  } else {
    return {};
  }
}
