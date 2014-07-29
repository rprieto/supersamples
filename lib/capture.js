var deep = require('deep');

var data;

// capture extra data about the currently running test
// this is reset between each test

exports.reset = function() {
  data = {};
};

exports.add = function(fields) {
  deep.extend(data, fields);
};

exports.get = function() {
  return data;
};

exports.hasData = function() {
  return Object.keys(data).length > 0;
};
