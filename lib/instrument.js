var inspect = require('./inspect');

// Instance to be instrumented
// Cannot be required here since it would be different from the one running the tests
// It need to be passed in by the tests themselves, calling capture()
var supertest = null;

// Keep the old overridden functions
var oldAssert = null;

// Latest captured request/response
exports.captured = null;

exports.capture = function(instance) {
  supertest = instance;
  oldAssert = supertest.Test.prototype.assert;
  supertest.Test.prototype.assert = function(res, fn) {
    exports.captured = {
      request: inspect.request(this),
      response: inspect.response(this, res)
    };
    oldAssert.call(this, res, fn);
  };
};

exports.restore = function() {
  supertest.Test.prototype.assert = oldAssert;
};
