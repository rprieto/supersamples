'use strict';

var helper = require('./../helper.js');

describe('Outer <describe> block', function () {

  describe('Inner <describe> block 1', function () {

    it('GET request 1', function () {
      var request = helper.server.get('/200').set('authToken', 'TokenValue').expect(200);
      helper.processRequest(this.test, request);
    });

    it('GET request 2', function () {
      var request = helper.server.get('/404').expect(404);
      helper.processRequest(this.test, request);
    });

  });

  describe('Inner <describe> block 2', function () {
    
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

})
