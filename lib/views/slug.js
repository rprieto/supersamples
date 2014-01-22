var util = require('util');

exports.from = function(str) {
  if (util.isArray(str)) {
    str = str.join('');
  }
  return str.toLowerCase().replace(/[^a-z]/ig, '-');
};
