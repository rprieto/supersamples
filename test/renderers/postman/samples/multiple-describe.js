'use strict';

var helper = require('./../helper.js');

describe('Outer <describe> block 1', function () {
  
  it('GET request 1', function () {
    var request = helper.server.get('/200').set('authToken', 'TokenValue').expect(200);
    helper.processRequest(this.test, request);
  });

});

describe('Outer <describe> block 2', function () {

  it('GET request 2', function () { 
    var request = helper.server.get('/json').expect(200);
    helper.processRequest(this.test, request);
  });

  it('POST request 3', function () {
    var request = helper.server
      .post('/200')
      .send({
        payloadField: {
          foo: '777',
          bar: '123'
        } 
      })
      .expect(200);

    helper.processRequest(this.test, request);
  });

});
