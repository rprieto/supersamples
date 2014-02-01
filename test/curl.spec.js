var should  = require('should');
var curl = require('../lib/curl');

describe('curl', function() {

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

    it('with a payload', function() {
      var cmd = curl.fromRequest({
        method: 'POST',
        path: '/foo',
        data: {
          hello: 'world',
          value: 123,
        }
      });
      cmd.should.eql('curl -X POST -d \'{"hello":"world","value":123}\' "http://localhost/foo"');
    });

  });

});
