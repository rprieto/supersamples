var http    = require('http');
var should  = require('should');
var request = require('supertest');
var inspect = require('../lib/inspect');

describe('inspect', function() {
  
  describe('requests', function() {

    var server = http.createServer(function(req, res) {
      res.writeHead(200);
      res.end();
    });

    it('inspects the method and path', function(done) {
      request(server)
      .get('/foo')
      .end(function() {
        inspect.request(this).should.eql({
          data: null,
          headers: {},
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
            'x-custom': '1234'
          },
          method: 'GET',
          path: '/foo'
        });
        done();
      });
    });

    it('ignores headers with no value, or from the blacklist', function(done) {
      request(server)
      .get('/foo')
      .set('accept-encoding', 'text/plain')
      .set('x-custom', '')
      .end(function() {
        inspect.request(this).should.eql({
          data: null,
          headers: {},
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

    it('inspects the response status and body', function(done) {
      var server = http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('hello world');
      });
      request(server)
      .get('/foo')
      .end(function(err, res) {
        inspect.response(this, res).should.eql({
          status: 200,
          headers: {},
          body: 'hello world',
        });
        done();
      });
    });

    it('can inspect JSON bodies as well', function(done) {
      var server = http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({hello: 'world'}));
      });
      request(server)
      .get('/foo')
      .end(function(err, res) {
        inspect.response(this, res).should.eql({
          status: 200,
          headers: {},
          body: {hello: 'world'},
        });
        done();
      });
    });

    it('extracts headers that were asserted on', function(done) {
      var server = http.createServer(function(req, res) {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'X-Transaction-Id': '999'
        });
        res.end('hello world');
      });
      request(server)
      .get('/foo')
      .expect('x-transaction-id', '999')
      .end(function(err, res) {
        inspect.response(this, res).should.eql({
          status: 200,
          headers: {
            'x-transaction-id': '999'
          },
          body: 'hello world',
        });
        done();
      });
    });

  });

});
