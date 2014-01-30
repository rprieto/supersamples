var http    = require('http');
var should  = require('should');
var request = require('supertest');
var instrument = require('../lib/instrument');

describe('instrument', function() {
  
  var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('hello world');
  });

  before(function() {
    instrument.capture(request);
  });

  after(function() {
    instrument.restore();
  });

  it('starts with an empty capture', function() {
    should.not.exist(instrument.captured);
  });

  it('can make a normal supertest request', function(done) {
    request(server)
      .get('/foo')
      .end(done);
  });

  it('captures the last request/response', function() {
    instrument.captured.should.eql({
      request: {
        data: null,
        headers: {},
        method: 'GET',
        path: '/foo'
      },
      response: {
        status: 200,
        headers: {},
        body: 'hello world'
      }
    });
  });

});
