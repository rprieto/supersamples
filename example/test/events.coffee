# These specs are written in CoffeeScript (personal choice)
# but would work just as well in JavaScript
request  = require 'supertest'
sinon    = require 'sinon'
server   = require '../src/server'
fixtures = require './fixtures'

# We use a sinon sandboxes to cleanup our stubs/mocks
# http://sinonjs.org/docs/#sinon-sandbox
sandbox = null


# You can group tests into categories with typical Mocha nested describe blocks
# The nested hierarchy is combined and merged across all test files
describe 'Events', ->


  # Load test fixtures
  # so we know exactly what our sample responses will be
  beforeEach ->
    sandbox = sinon.sandbox.create()
    fixtures.fakeSports(sandbox)

  # Reset stubs
  afterEach ->
    sandbox.restore()


  # Nested describe block
  # The first two nested levels will be used for navigation in the generated docs
  describe 'Sports', ->


    # Test name and summary
    # This is markdown text that will appear in the docs
    it '''
       Get list of sports

       - list is ordered alphabetically
       - doesn't return sports with no active competitions
       ''', () ->

       # The expected request/response sample using "supertest"
       # 
       # For more details on all possible operations
       # see https://github.com/visionmedia/supertest
       # and https://github.com/visionmedia/superagent
       #
       # Note: if you specify multiple assertions on the body or on a given header
       # the documentation will only show the first one

       request(server)
       .get('/sports')
       .set('Accept', 'application/json')
       .expect(200)
       .expect('Content-Type', /json/)
       .expect(
         sports: [
           { id: 1, name: 'Soccer' }
           { id: 2, name: 'Tennis' }
         ]
       )



  # Just another API sample
  describe 'Competitions', ->

    it '''
       Competitions by sport

       - List of **open** competitions for a given sport.
       - Returns all countries by default.    
       ''', () ->

       request(server)
       .get('/sports/1/competitions')
       .set('Accept', 'application/json')
       .expect(200)
       .expect('Content-Type', /json/)
       .expect(
         competitions: [
           { id: 1, country: 'gb', name: 'English premier league' }
           { id: 2, country: 'fr', name: 'Coupe de France' }
         ]
       )

    it '''
       Filter by country

       - Only get competitions for a given country
       - Uses the official ISO [country codes](http://en.wikipedia.org/wiki/ISO_3166-1)
       ''', () ->

       request(server)
       .get('/sports/1/competitions?country=fr')
       .set('Accept', 'application/json')
       .expect(200)
       .expect('Content-Type', /json/)
       .expect(
         competitions: [
           { id: 2, country: 'fr', name: 'Coupe de France' }
         ]
       )
