var _ = require('lodash');
var module = require('module');

var _load = module._load;

var moduleNames = {};
var processed = [];

exports.register = function(name, instrument) {
  moduleNames[name] = instrument;
};

exports.reset = function() {
  _(moduleNames).forEach(function(instrument) {
    instrument.restore();
  })
  moduleNames = {};
  processed = [];
}

module._load = function(path) {
  var mdl = _load.apply(this, arguments);
  var hasPatch = moduleNames.hasOwnProperty(path)
  var alreadyProcessed = processed.indexOf(path) > -1;
  if (hasPatch && !alreadyProcessed) {
    console.log('Instrumenting ', path)
    moduleNames[path].instrument(mdl);
    processed.push(path);
  }
  return mdl;
};
