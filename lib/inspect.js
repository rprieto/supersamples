var _ = require('lodash');

// These headers are set on every request
// But no useful for the documentation
var requestHeaderBlacklist = [
  'host',
  'accept-encoding'
];

exports.request = function(superTest) {
  return {
    data: superTest._data,
    headers: requestHeaders(superTest),
    method: superTest.req.method,
    path: superTest.req.path
  };
}

exports.response = function(superTest, response) {
  // show the real response body regardless of the asserts
  // since it's not always practical to assert on the whole body object
  return {
    status: response.status,
    headers: responseHeaders(superTest, response),
    body: superTest.res.body || superTest.res.text
  };
}

function requestHeaders(superTest) {
  return _.omit(superTest.req._headers, function(value, key) {
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
