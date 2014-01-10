// needed to be able to load CoffeeScript test files
require('coffee-script');

var fs      = require('fs');
var path    = require('path');
var wrench  = require('wrench');
var Mocha   = require('mocha');

var samples        = require('./samples');
var testSuite      = require('./test_suite');
var viewModel      = require('./view_model');
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
  
  // Create the nested Mocha test suite
  var suite = testSuite.from(samples.get());
  
  // Create the document view model
  var model = viewModel.from(samples.get());

  // Run the tests!
  var runner = new Mocha.Runner(suite);
  var reporter = new Mocha.reporters.Spec(runner);

  runner.run(function (failures) {
    if (failures > 0) {
      console.error('Docs not generated\n');
      process.exit(1);
    } else {
      documentation.write(model, outputFolder);
      console.log('Docs generated in ' + outputFolder + '\n');
      process.exit(0);
    }
  });

};
