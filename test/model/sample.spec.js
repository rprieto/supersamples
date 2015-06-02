var http    = require('http');
var should  = require('should');
var request = require('supertest');
var sample  = require('../../lib/model/sample');
var capture = require('../../lib/capture');

describe('sample', function() {

  var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  beforeEach(function() {
    capture.reset();
  });

  it('uses the <it> as a default sample name', function(done) {
    var test = this.test;
    request(server)
    .get('/foo')
    .end(function(err, res) {
      var s = sample.create(test, capture.get().request, capture.get().response);
      s.should.have.property('name', 'uses the <it> as a default sample name');
      done();
    });
  });

  it("\n  removes surrounding whitespace from a samples name  \n", function(done){
    var test = this.test;
    request(server)
    .get('/foo')
    .end(function(err, res) {
      var s = sample.create(test, capture.get().request, capture.get().response);
      s.should.have.property('name', 'removes surrounding whitespace from a samples name');
      done();
    });
  });

  it('can override the name with a custom property', function(done) {
    var test = this.test;
    this.supersamples = { name: 'my custom sample' };
    request(server)
    .get('/foo')
    .end(function(err, res) {
      var s = sample.create(test, capture.get().request, capture.get().response);
      s.should.have.property('name', 'my custom sample');
      done();
    });
  });

});
