var util = require('util');

exports.from = function(str) {
  if (util.isArray(str)) {
    str = str.join('');
  }
  return 'link' + str.toLowerCase().replace(/[^a-z]/ig, '');
};
