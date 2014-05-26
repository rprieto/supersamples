var path      = require('path');
var mocha     = require('mocha');
var capture   = require('./capture');
var samples   = require('./model/samples');
var render    = require('./render');

var Base = mocha.reporters.Dot;

samples.reset();

function MyReporter(runner) {

  Base.call(this, runner);

  runner.on('test', function(test) {
    capture.reset();
  });

  runner.on('pass', function(test) {
    // if we captured anything, it must be an API sample
    if (capture.hasData()) {
      test.request  = capture.get().request;
      test.response = capture.get().response;
      test.route    = capture.get().route;
      samples.add(test);
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
      console.error(ex.stack);
      process.exit(1);
    }
  });

}

MyReporter.prototype.__proto__ = Base.prototype;

module.exports = MyReporter;
