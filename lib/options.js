var fs    = require('fs');
var path  = require('path');
var cjson = require('cjson');
var _     = require('lodash');

var data = null;

var OPTS_FILE = 'supersamples.opts';

var DEFAULTS = {
  baseUrl: 'http://localhost',
  renderers: {
    html: {
      outputFolder: './tmp',
      title: 'API Documentation',
      intro: null,
      files: {
        "example/docs/files/**": "."
      },
      styles: [
        'custom.css'
      ]
    }
  },
  lint: {}
};

exports.read = function() {
  if (fs.existsSync(OPTS_FILE) === false) {
    console.log(OPTS_FILE + ' not found, using default options');
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
