var http    = require('http');
var should  = require('should');
var request = require('supertest');
var capture = require('../../lib/capture');

describe('instruments / superagent', function() {

  describe('requests', function() {

    var server = http.createServer(function(req, res) {
      res.writeHead(200);
      res.end();
    });

    beforeEach(function() {
      capture.reset();
    });

    it.only('inspects binary payloads', function(done) {
      req = request(server).post('/foo')
      req.write(new Buffer([0x01, 0x02, 0x03, 0x04]))
      req.end(function() {
        capture.get().request.data.should.eql('\u0001\u0002\u0003\u0004');
        capture.get().request.binary.should.eql(true);
        done();
      });
    });

  });

});
