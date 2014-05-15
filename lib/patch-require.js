var _ = require('lodash');
var module = require('module');

var _load = module._load;

var moduleNames = {};
var processed = [];

exports.module = function(name, fn) {
  moduleNames[name] = fn;
};

module._load = function(path) {
  var mdl = _load.apply(this, arguments);
  var hasPatch = moduleNames.hasOwnProperty(path)
  var alreadyProcessed = processed.indexOf(path) > -1;
  if (hasPatch && !alreadyProcessed) {
    console.log('Instrumenting ', path)
    moduleNames[path](mdl);
    processed.push(path);
  }
  return mdl;
};
