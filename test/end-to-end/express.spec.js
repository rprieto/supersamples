var express = require('express')
var should  = require('should');
var request = require('supertest');
var capture = require('../../lib/capture');

describe('instrument express / supertest / superagent', function() {

  beforeEach(function() {
    capture.reset();
  });

  describe('request', function() {

    var server = express()
    server.get('/foo/:bar', function(req, res) {
      res.send({ hello: req.params.bar })
    })
    server.post('/foo', function(req, res) {
      res.send({ hello: 'world' })
    })

    it('inspects the method and path', function(done) {
      request(server)
      .get('/foo/bar')
      .end(function() {
        capture.get().request.should.eql({
          headers: {},
          method: 'GET',
          path: '/foo/bar',
          route: '/foo/:bar'
        });
        done();
      });
    });

    it('inspects custom headers', function(done) {
      request(server)
      .get('/foo/bar')
      .set('x-custom', '1234')
      .end(function() {
        capture.get().request.should.eql({
          headers: {
            'x-custom': '1234'
          },
          method: 'GET',
          path: '/foo/bar',
          route: '/foo/:bar'
        });
        done();
      });
    });

    it('ignores headers with no value, or from the blacklist', function(done) {
      request(server)
      .get('/foo/bar')
      .set('accept-encoding', 'text/plain')
      .set('x-custom', '')
      .end(function() {
        capture.get().request.should.eql({
          headers: {},
          method: 'GET',
          path: '/foo/bar',
          route: '/foo/:bar'
        });
        done();
      });
    });

    it('inspects JSON payloads', function(done) {
      request(server)
      .post('/foo')
      .send({value: 1234})
      .end(function() {
        capture.get().request.should.eql({
          data: {
            value: 1234
          },
          headers: {
            'content-type': 'application/json',
            'content-length': 14
           },
          method: 'POST',
          path: '/foo',
          route: '/foo'
        });
        done();
      });
    });

    it('inspects binary payloads', function(done) {
      req = request(server).post('/foo')
      req.write(new Buffer([0x01, 0x02, 0x03, 0x04]))
      req.end(function() {
        capture.get().request.should.eql({
          data: new Buffer([0x01, 0x02, 0x03, 0x04]),
          headers: {},
          method: 'POST',
          path: '/foo',
          route: '/foo'
        });
        done();
      });
    });

  });

  describe('response', function() {

    it('inspects the response status and body', function(done) {
      var server = express()
      server.get('/foo/:bar', function(req, res) {
        res.send('hello world')
      })
      request(server)
      .get('/foo/bar')
      .end(function(err, res) {
        capture.get().response.should.eql({
          status: 200,
          headers: {},
          body: 'hello world',
        });
        done();
      });
    });

    it('can inspect JSON bodies as well', function(done) {
      var server = express()
      server.get('/foo/:bar', function(req, res) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({hello: 'world'}))
      })
      request(server)
      .get('/foo/bar')
      .end(function(err, res) {
        capture.get().response.should.eql({
          status: 200,
          headers: {},
          body: {hello: 'world'},
        });
        done();
      });
    });

    it('can inspect responses with no bodies', function(done) {
      var server = express()
      server.get('/foo/:bar', function(req, res) {
        res.send()
      })
      request(server)
      .get('/foo/bar')
      .end(function(err, res) {
        capture.get().response.should.eql({
          status: 200,
          headers: {},
          body: '',
        });
        done();
      });
    });

    it('extracts headers that were asserted on', function(done) {
      var server = express()
      server.get('/foo/:bar', function(req, res) {
        res.set('Content-Type', 'text/plain');
        res.set('X-Transaction-Id', '999')
        res.send('hello world')
      })
      request(server)
      .get('/foo/bar')
      .expect('x-transaction-id', '999')
      .end(function(err, res) {
        capture.get().response.should.eql({
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