var _       = require('lodash');
var url     = require('url');
var capture = require('../capture');


exports.processParams = function(layer, called, req, res, fn) {
  if (layer.route) {
    var params = exports.params(url.parse(req.url, true).query)

    capture.add({
      request: {
        route: exports.route(layer.route, params)
      }
    });
  }

  return this.__shimmed.process_params.call(this, layer, called, req, res, fn);
};

exports.route = function(route, params) {
  // if error is 404, the route would be undefined
  if (!route) {
    return null;
  }

  if (params != '') {
    return route.path + '?' + params;
  } else {
    return route.path;
  }
};

exports.params = function(params) {
  return _.map(params, function(value, key) {
    return key + "=$" + key;
  }).join('&')
};
