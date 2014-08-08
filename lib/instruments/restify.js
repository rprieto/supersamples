var _       = require('lodash');
var url     = require('url');
var capture = require('../capture');


exports.find = function(req, res, fn) {
  var params = exports.params(url.parse(req.url, true).query)
  var wrapped = function (error, route, context) {
    capture.add({
      request: {
        route: exports.route(route, params)
      }
    });
    return fn(error, route, context);
  };
  return this.__shimmed.find.call(this, req, res, wrapped);
};

exports.route = function(route, params) {
  // if error is 404, the route would be undefined
  if (!route) {
    return null;
  }

  if (params != '') {
    return route.spec.path + '?' + params;
  } else {
    return route.spec.path;
  }
};

exports.params = function(params) {
  return _.map(params, function(value, key) {
    return key + "=$" + key;
  }).join('&')
};
