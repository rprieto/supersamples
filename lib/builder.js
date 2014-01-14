var _       = require('lodash');
var samples = require('./samples');
var request = require('supertest');

module.exports = function(app, callback) {

  var api = {};

  api.sample = function(callback) {

    // Default values
    var spec = {
      name: 'Heading / Group / Sample name',
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

    // Just split the group into an array
    spec.group = spec.group.split('/').map(trim);
    samples.add(spec);

  };

  callback(api);

};

function trim(str) {
  return str.trim();
}
