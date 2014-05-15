var _ = require('lodash');
var capture = require('../capture');


// ---------------------------------
// Instrument the <supertest> module
// ---------------------------------


var supertest = null;
var oldAssert = null;

exports.instrument = function(instance) {
  supertest = instance;
  oldAssert = supertest.Test.prototype.assert;
  supertest.Test.prototype.assert = function(res, fn) {
    captureAssert(this, res);
    oldAssert.call(this, res, fn);
  };
};

exports.restore = function() {
  supertest.Test.prototype.assert = oldAssert;
};



// ------------------------------------
// Helpers to extract the response data
// ------------------------------------


// These headers are set on every request
// But not very useful in the documentation
var requestHeaderBlacklist = [
  'host',
  'accept-encoding'
];

function captureAssert(superTest, response) {
  // request
  var requestFields = {
    headers: requestHeaders(superTest.req),
    method: superTest.req.method,
    path: superTest.req.path
  };
  if (superTest._data) {
    requestFields.data = superTest._data;
  }
  // response
  var responseFields = {
    status: response.status,
    headers: responseHeaders(superTest, response),
    body: superTest.res.body || superTest.res.text
  };
  capture.add({
    request: requestFields,
    response: responseFields
  });
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
