var should     = require('should');
var instrument = require('../../lib/instruments/restify');

describe('instruments / restify', function() {

  describe('route', function() {
    it('should create route without params', function() {
      var route = instrument.route({spec:{path:'/url/:id'}}, '')
      route.should.eql('/url/:id');
    })

    it('should create route with params', function() {
      var route = instrument.route({spec:{path:'/url/:id'}}, 'param1=$param1')
      route.should.eql('/url/:id?param1=$param1');
    })

    it('should return null if route does not exists', function () {
      var route = instrument.route();
      should.not.exist(route);
    })
  });

  describe('params', function() {
    it('should tokenise params', function() {
      var params = instrument.params({param1: 'value1', param2: 'value2'});
      params.should.eql('param1=$param1&param2=$param2');
    });
  });

});
