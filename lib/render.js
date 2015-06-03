var _        = require('lodash');
var fs       = require('fs-extra');
var path     = require('path');
var options  = require('./options');

//
// For now we assume synchronous rendering
//

exports.toDisk = function(model) {
  var opts = options.get();
  _.forEach(opts.lint, function(options, name){
    lint(name, options, model);
  })
  _.forEach(opts.renderers, function(options, name) {
    render(name, options, model);
  });
  console.log('\nDone!\n');
};

function lint(name, options, model){
  var instance = null;
  try {
    instance = require('./linters/' + name);
  } catch(ex) {
    console.error('Unsupported linter: ' + name);
    return;
  }
  console.log('\n-> Linting ' + name);
  var errors = instance.lint(model, options).errors

  if(errors.length){
    var message = name + " found invalid samples: " + errors.join(", ");

    switch(options){
    case 1:
        console.warn('WARNING: ' + message)
        break;
      case 2:
        console.error('ERROR: ' + message)
        process.exit(1)
        break;
    }
  }
}

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
