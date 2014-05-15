var http       = require('http');
var should     = require('should');
var restify    = require('restify');
var request    = require('supertest');
var instrument = require('../../lib/instruments/restify');

describe('instruments / restify', function() {

  describe('route', function() {
    it('should create route without params', function() {
      route = instrument.route({spec:{path:'/url/:id'}}, '')
      route.tokenisedRoute.should.eql('/url/:id')
    })

    it('should create route with params', function() {
      route = instrument.route({spec:{path:'/url/:id'}}, 'param1=$param1')
      route.tokenisedRoute.should.eql('/url/:id?param1=$param1')
    })
  });

  describe('params', function() {
    it('should tokenise params', function() {
      params = instrument.params({param1: "value1", param2:"value2"})
      params.should.eql("param1=$param1&param2=$param2")
    });
  });

});
