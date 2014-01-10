var _       = require('lodash');
var samples = require('./samples');
var request = require('supertest');

module.exports = function(app, callback) {

  var api = {};

  api.sample = function(callback) {

    // Default values
    var spec = {
      nav: 'API / Group',
      name: 'Sample name',
      summary: 'Sample summary',
      before: [],
      request: request(app).get('/'),
      response: {
        status: 200,
        headers: {},
        body: {}
      }
    };

    // Let the test fill them out
    callback(spec, request(app));

    // A few extra fields
    var computed = {
      groups: spec.nav.split('/').map(trim)
    };

    // We have a sample
    samples.push(_.extend({}, spec, computed));
  };

  callback(api);

};

function trim(str) {
  return str.trim();
}
