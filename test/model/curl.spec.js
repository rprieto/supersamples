var should  = require('should');
var sinon   = require('sinon');
var curl    = require('../../lib/model/curl');
var options = require('../../lib/options');

describe('curl', function() {

  before(function() {
    sinon.stub(options, 'get').returns({
      baseUrl: 'http://localhost'
    });
  });

  after(function() {
    options.get.restore();
  });

  describe('GET', function() {

    it('to a given URL', function() {
      var cmd = curl.fromRequest({
        method: 'GET',
        path: '/foo/bar?with=params'
      });
      cmd.should.eql('curl -X GET "http://localhost/foo/bar?with=params"');
    });

    it('with headers', function() {
      var cmd = curl.fromRequest({
        method: 'GET',
        path: '/foo',
        headers: {
          'Accept': 'text/plain',
          'X-Custom': '1234'
        }
      });
      cmd.should.eql('curl -X GET -H "Accept: text/plain" -H "X-Custom: 1234" "http://localhost/foo"');
    });

  });

  describe('POST', function() {

    it('with a JSON payload', function() {
      var cmd = curl.fromRequest({
        method: 'POST',
        path: '/foo',
        data: {
          hello: 'world',
          value: 123,
        },
        binary: false
      });
      cmd.should.eql('curl -X POST -d \'{"hello":"world","value":123}\' "http://localhost/foo"');
    });

    it('with a binary payload', function() {
      var cmd = curl.fromRequest({
        method: 'POST',
        path: '/foo',
        data: null,
        binary: true
      });
      cmd.should.eql('cat binary_file | curl -X POST --data-binary @- "http://localhost/foo"');
    });

  });

});
