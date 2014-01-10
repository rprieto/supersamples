#!/usr/bin/env node

var util      = require('util');
var program   = require('commander');
var runner    = require('../lib/runner');

program
  .version('0.0.1')
  .option('-i, --input <folder>', 'Folder containing the tests')
  .option('-o, --output <folder>', 'Output folder')
  .parse(process.argv);

if (!program.input || !program.output) {
  program.help();
}

runner.run(program.input, program.output);
