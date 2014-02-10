var fs    = require('fs');
var path  = require('path');
var cjson = require('cjson');
var _     = require('lodash');

var data = null;

var OPTS_FILE = 'supersamples.opts';

var DEFAULTS = {
  title: 'API Documentation',
  intro:  null,
  baseUrl: 'http://localhost',
  styles: [],
  output: './tmp'
};

exports.read = function() {
  if (fs.exists(OPTS_FILE) === false) {
    return DEFAULTS;
  }
  try {
    var opts = cjson.load(OPTS_FILE);
    return _.defaults(opts, DEFAULTS);
  } catch (ex) {
    console.error('Invalid config file: ' + path.resolve('supersamples.opts'));
    console.error(ex);
    process.exit(1);
  }
};

exports.get = function() {
  if (!data) data = exports.read();
  return data;
};

