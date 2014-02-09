// capture extra data about the currently running test
// this is reset between each test

exports.reset = function() {
  data = {};
};

exports.add = function(fields) {
  Object.keys(fields).forEach(function(key) {
    data[key] = fields[key];
  });
};

exports.get = function() {
  return data;
};

exports.hasData = function() {
  return Object.keys(data).length > 0;
};
