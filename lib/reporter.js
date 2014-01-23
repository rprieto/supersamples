var path     = require('path');
var mocha    = require('mocha');
var options  = require('./options');
var samples  = require('./samples');
var inspect  = require('./inspect');
var documentation  = require('./documentation');

var Base = mocha.reporters.Dot;
var opts = options.read();

var currentSample = null;
samples.reset();

function MyReporter(runner) {

  Base.call(this, runner);

  runner.on('test', function(test) {
    currentSample = test;
  });

  runner.on('pass', function(test) {
    if (currentSample.request) {
      samples.add(currentSample);
    }
  });

  runner.on('end', function() {
    try {
      if (this.failures > 0) {
        throw new Error('Tests failed, no documentation generated');
      }
      documentation.write(samples, opts);
      console.log('\nFound ' + samples.get().length + ' samples');
      console.log('Documentation generated in: ' + path.resolve(opts.output) + '\n');
      process.exit(0);
    } catch (ex) {
      console.error('\n' + ex.message + '\n');
      process.exit(1);
    }
  });

}

MyReporter.prototype.__proto__ = Base.prototype;

// Instrument a "required" instance of supertest
// to capture the requests & responses
MyReporter.instrument = function(supertest) {
  var oldEnd = supertest.Test.prototype.end;
  var oldAssert = supertest.Test.prototype.assert;
  supertest.Test.prototype.end = function(fn) {
    if (currentSample) {
      currentSample.request = inspect.request(this)
    }
    oldEnd.call(this, fn);
  };
  supertest.Test.prototype.assert = function(res, fn) {
    if (currentSample) {
      currentSample.response = inspect.response(this, res);
    }
    oldAssert.call(this, res, fn);
  };
};

module.exports = MyReporter;
