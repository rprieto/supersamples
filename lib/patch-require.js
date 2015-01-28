var _ = require('lodash');
var module = require('module');

var _load = module._load;

var moduleNames = {};

exports.module = function(name, fn) {
  moduleNames[name] = fn;
};

module._load = function(path) {
  var mdl = _load.apply(this, arguments);
  var hasPatch = moduleNames.hasOwnProperty(path)
  if (hasPatch && !mdl.__supersamplesPatched) {
    console.log('Instrumenting ', path)
    moduleNames[path](mdl);
    mdl.__supersamplesPatched = true;
  }
  return mdl;
};
