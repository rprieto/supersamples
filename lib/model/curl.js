var _       = require('lodash');
var options = require('../options');

exports.fromRequest = function(req) {
  return standardIn(req)
       + 'curl -X '
       + req.method + ' '
       + headers(req)
       + payload(req)
       + '"' + options.get().baseUrl + req.path + '"';
};

function standardIn(req) {
  if (req.binary) return 'cat binary_file | ';
  else return '';
}

function headers(req) {
  return _(req.headers).reduce(function(memo, value, key) {
    memo += '-H "' + key + ': ' + value + '" ';
    return memo;
  }, '');
}

function payload(req) {
  if (req.binary) return '--data-binary @- '
  else if (!req.data) return '';
  else return '-d \'' + JSON.stringify(req.data) + '\' ';
}
