var _ = require('lodash');

exports.lint = function (samples) {
  var counts = _.countBy(samples, 'name');
  var dups = _.pickBy(counts, function (count) {
    return count > 1
  })
  var errors = _.map(dups, function (val, key) {
    return key + ' (' + val + ' instances)';
  });
  return {
    errors: errors
  }
}