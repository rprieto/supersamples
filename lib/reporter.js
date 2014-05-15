var path           = require('path');
var mocha          = require('mocha');
var options        = require('./options');
var capture        = require('./capture');
var samples        = require('./model/samples');
var documentation  = require('./renderers/html/documentation');

var Base = mocha.reporters.Dot;
var opts = options.get();

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

module.exports = MyReporter;
