var _ = require('lodash');

exports.lint = function(samples){
  var counts = _.countBy(samples, 'name');
  var dups = _.pick(counts, function(count){ return count > 1} )
  var errors = _.map(dups, function(val, key) {
    return key + ' (' + val + ' instances)';
  });
  return {errors: errors}
}
