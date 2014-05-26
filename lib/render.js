var _        = require('lodash');
var fs       = require('fs-extra');
var path     = require('path');
var options  = require('./options');

//
// For now we assume synchronous rendering
//

exports.toDisk = function(model) {
  var opts = options.get();
  _.forEach(opts.renderers, function(options, name) {
    render(name, options, model);
  });
  console.log('\nDone!\n');
};

function render(name, options, model) {
  var instance = null;
  try {
    instance = require('./renderers/' + name + '/index');
  } catch(ex) {
    console.error('Unsupported renderer: ' + name);
    return;
  }
  console.log('\n-> Building ' + name);
  instance.render(model, options);
}
