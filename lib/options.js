var fs = require('fs');
var _  = require('lodash');

var DEFAULTS = {
  intro:  null,
  styles: [],
  output: './tmp'
};

exports.read = function() {
  try {
    var content = fs.readFileSync('supersamples.opts').toString();
    var opts = JSON.parse(content);
    return _.defaults(opts, DEFAULTS);
  } catch (ex) {
    return DEFAULTS;
  }
};
