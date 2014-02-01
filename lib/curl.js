var _ = require('lodash');
var HOST = "http://localhost"

exports.fromRequest = function(req) {
  return 'curl -X '
       + req.method + ' '
       + headers(req)
       + payload(req)
       + '"' + HOST + req.path + '"';
};

function headers(req) {
  return _(req.headers).reduce(function(memo, value, key) {
    memo += '-H "' + key + ': ' + value + '" ';
    return memo;
  }, '');
}

function payload(req) {
  if (!req.data) return '';
  return '-d \'' + JSON.stringify(req.data) + '\' ';
}
