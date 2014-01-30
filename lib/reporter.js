var path           = require('path');
var mocha          = require('mocha');
var options        = require('./options');
var samples        = require('./samples');
var instrument     = require('./instrument');
var documentation  = require('./documentation');

var Base = mocha.reporters.Dot;
var opts = options.read();

samples.reset();

function MyReporter(runner) {

  Base.call(this, runner);

  runner.on('test', function(test) {
    // reset the capture
    instrument.captured = null;
  });

  runner.on('pass', function(test) {
    // if we captured anything, must be an API sample
    if (instrument.captured) {
      test.request  = instrument.captured.request;
      test.response = instrument.captured.response;
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
MyReporter.instrument = instrument.capture;

module.exports = MyReporter;
