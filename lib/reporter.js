var path      = require('path');
var mocha     = require('mocha');
var options   = require('./options');
var capture   = require('./capture');
var sample    = require('./model/sample');
var samples   = require('./model/samples');
var render    = require('./render');

var reporter = options.get().reporter;
var Base = mocha.reporters[reporter];

if (!Base) {
  console.error('Invalid mocha reporter: ' + reporter);
  process.exit(1);
}

samples.reset();

function MyReporter(runner) {

  Base.call(this, runner);

  runner.on('test', function(test) {
    capture.reset();
    test.ctx.supersamples = null;
  });

  runner.on('pass', function(test) {
    // if we captured anything, it must be an API sample
    var shouldIgnore = test.ctx.supersamples && test.ctx.supersamples.ignore === true

    if (!shouldIgnore && capture.hasData()) {
      var request  = capture.get().request;
      var response = capture.get().response;
      samples.add(sample.create(test, request, response));
    }
  });

  runner.on('end', function() {
    console.log('\nFound ' + samples.get().length + ' samples');
    try {
      if (this.failures > 0) {
        throw new Error('Tests failed, no documentation generated');
      }
      render.toDisk(samples.get());
    } catch (ex) {
      console.log('');
      console.error(ex.message);
      console.error(ex.stack);
      process.exit(1);
    }
  });

}

MyReporter.prototype.__proto__ = Base.prototype;

module.exports = MyReporter;
