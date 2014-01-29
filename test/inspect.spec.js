var http    = require('http');
var should  = require('should');
var request = require('supertest');
var inspect = require('../lib/inspect');

describe('inspect', function() {
  
  var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('hello world');
  });

  describe('requests', function() {

    it('inspects the method and path', function(done) {
      request(server)
      .get('/foo')
      .end(function() {
        inspect.request(this).should.eql({
          data: null,
          headers: {'accept-encoding': 'gzip, deflate'},
          method: 'GET',
          path: '/foo'
        });
        done();
      });
    });

    it('inspects custom headers', function(done) {
      request(server)
      .get('/foo')
      .set('x-custom', '1234')
      .end(function() {
        inspect.request(this).should.eql({
          data: null,
          headers: {
            'accept-encoding': 'gzip, deflate',
            'x-custom': '1234'
          },
          method: 'GET',
          path: '/foo'
        });
        done();
      });
    });

    it('inspects payloads', function(done) {
      request(server)
      .post('/foo')
      .send({value: 1234})
      .end(function() {
        inspect.request(this).should.eql({
          data: {value: 1234},
          headers: {
            'accept-encoding': 'gzip, deflate',
            'content-type': 'application/json',
            'content-length': 14
           },
          method: 'POST',
          path: '/foo'
        });
        done();
      });
    });

  });

  describe('responses', function() {

  });

});
