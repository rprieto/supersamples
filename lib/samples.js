
var samples = [];

exports.reset = function() {
  samples = [];
}

exports.get = function() {
  return samples;
};

exports.push = function(res) {
  samples.push(res);
};
