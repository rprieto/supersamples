var should  = require('should');
var curl = require('../lib/curl');

describe('curl', function() {

  describe('GET', function() {

    it('without headers', function() {
      var cmd = curl.fromRequest({
        method: 'GET',
        path: '/foo'
      });
      cmd.should.eql('curl -X GET http://localhost/foo');
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
      cmd.should.eql('curl -X GET -H "Accept: text/plain" -H "X-Custom: 1234" http://localhost/foo');
    });

  });

});
