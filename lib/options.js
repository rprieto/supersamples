var fs   = require('fs');
var path = require('path');
var _    = require('lodash');

var DEFAULTS = {
  title: null,
  intro:  null,
  styles: [],
  output: './tmp'
};

exports.read = function() {
  var content = null;
  try {
    content = fs.readFileSync('supersamples.opts').toString();
  } catch (ex) {
    return DEFAULTS;
  }
  try {
    var opts = JSON.parse(content);
    return _.defaults(opts, DEFAULTS);
  } catch (ex) {
    console.error('Invalid config file: ' + path.resolve('supersamples.opts'));
    process.exit(1);
  }
};
