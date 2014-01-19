// needed to be able to load CoffeeScript test files
require('coffee-script');

var fs      = require('fs');
var path    = require('path');
var wrench  = require('wrench');
var Mocha   = require('mocha');

var samples        = require('./samples');
var testSuite      = require('./test_suite');
var documentation  = require('./documentation');


exports.run = function (inputFolder, outputFolder) {

  samples.reset();

  // Require all test files
  var files = wrench.readdirSyncRecursive(inputFolder);
  files.forEach(function (filepath) {
    var fullpath = path.join(inputFolder, filepath);
    if (fs.statSync(fullpath).isFile()) {
      require(path.resolve(fullpath));
    }
  });
  
  // Prepare the test suite
  var suite = testSuite.from(samples);  
  var runner = new Mocha.Runner(suite);
  var reporter = new Mocha.reporters.Spec(runner);

  // Run the tests
  // And generate the docs
  runner.run(function (failures) {
    if (failures > 0) {
      console.error('Docs not generated\n');
      process.exit(1);
    } else {
      documentation.write(samples, outputFolder);
      console.log('Docs generated in ' + outputFolder + '\n');
      process.exit(0);
    }
  });

};
