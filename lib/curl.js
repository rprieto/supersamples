var _ = require('lodash');
var HOST = "http://localhost"

exports.fromRequest = function(req) {
  var headers = _(req.headers).reduce(headerArg, '');
  return 'curl -X ' + req.method + ' ' + headers + HOST + req.path;
  //return 'curl -X POST -H "Content-Type: application/json" -d \'{"name":"bob"}\' http://localhost/login';
};

function headerArg(memo, value, key) {
  memo += '-H "' + key + ': ' + value + '" ';
  return memo;
};
