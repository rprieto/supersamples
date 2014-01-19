
var samples = [];

exports.reset = function() {
  samples = [];
}

exports.add = function(res) {
  res.id = samples.length;
  samples.push(res);
};

/*
  [
    { sample },
    { sample },
    { sample }
  ]
*/
exports.get = function() {
  return samples;
};

/*
  {
    heading1: {
      group1: [ sample, sample ],
      group2: [ sample, sample ]
    },
    heading2: {
      group3: [ sample, sample ]
    }
  }
*/
exports.getNested = function() {
  return samples.reduce(function(acc, sample) {
    var heading = sample.group[0];
    var group   = sample.group[1];
    acc[heading] = acc[heading] || {};
    acc[heading][group] = acc[heading][group] || [];
    acc[heading][group].push(sample);
    return acc;
  }, {});
}
