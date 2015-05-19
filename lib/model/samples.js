var curl = require('./curl');

var samples = [];

exports.reset = function() {
  samples = [];
}

exports.add = function(sample) {
  sample.id = samples.length;
  samples.push(sample);
};

exports.get = function() {
  return samples;
}
