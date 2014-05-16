var fs       = require('fs-extra');
var path     = require('path');
var options  = require('./options');

exports.toDisk = function(model) {

  var opts = options.get();
  fs.mkdirpSync(opts.output);

  if (opts.renderer.name !== 'html') {
    throw 'Unsupported renderer: ' + opts.renderer.name;
  }

  var chosen = require('./renderers/' + opts.renderer.name + '/index');
  chosen.render(model, opts.output, opts.renderer.options);

  // For now we assume synchronous rendering
  // This could be a callback
  console.log('Documentation generated in: ' + path.resolve(opts.output) + '\n');

};
