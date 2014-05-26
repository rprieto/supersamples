var _       = require('lodash');
var url     = require('url');
var capture = require('../capture');


exports.find = function(req, res, fn) {
  params = exports.params(url.parse(req.url, true).query)
  var wrapped = function (error, route, context) {
    capture.add({
      route: exports.route(route, params)
    });
    return fn(error, route, context);
  };
  return this.__shimmed.find.call(this, req, res, wrapped);
};

exports.route = function(route, params) {
  tokenisedRoute = route.spec.path
  if (params != '') {
    tokenisedRoute += "?" + params
  }
  return {
    tokenisedRoute: tokenisedRoute
  }
};

exports.params = function(params) {
  return _.map(params, function(value, key) {
    return key + "=$" + key
  }).join('&')
};
