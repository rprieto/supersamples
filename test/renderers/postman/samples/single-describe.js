'use strict';

var helper = require('./../helper.js');

describe('Single outer <describe> block', function () {

  it('GET request 1', function (done) {
    var request = helper.server.get('/200').set('authToken', 'TokenValue').expect(200);
    helper.processRequest(this.test, request, done);
  });

  it('GET request 2', function (done) {
    var request = helper.server.get('/json').expect(200);
    helper.processRequest(this.test, request, done);
  });

  it('POST request 3', function (done) {
    var request = helper.server
      .post('/200')
      .send({
        payloadField: {
          foo: '777',
          bar: '123'
        } 
      })
      .expect(200);

    helper.processRequest(this.test, request, done);
  });

});

