var _ = require('lodash');

exports.lint = function(samples){
  var counts = {}
  samples.forEach(function(sample){
    if(!counts[sample.name]){
      counts[sample.name] = 0;
    }
    counts[sample.name] = counts[sample.name] + 1;
  })
  var errors = []
  _.forEach(counts, function(count, name){
    if(count > 1){
      errors = errors.concat(name + ' (' + count + ' instances)')
    }
  })
  return {errors: errors}
}
