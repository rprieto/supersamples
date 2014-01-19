# These specs are written in CoffeeScript to adds in legibility (personal choice)
# But it would work just as well in JavaScript

swatch  = require 'api-swatch'
server  = require '../src/server'
fixtures = require './fixtures'


# Let's go!
swatch server, (api) ->


  # First API sample
  # This represents an action on a concrete resource, with a request/response pair
  api.sample (spec, agent) ->

    # A two-level category
    # Samples are grouped across all test files to create the side navigation
    spec.group = 'Events / Sports'

    # A single-line name for this sample
    spec.name  = 'Get list of sports'

    # Optional Markdown text displayed with each sample
    spec.summary =
      '''
      - list is ordered alphabetically
      - doesn't return sports with no active competitions
      '''

    # Array of functions to execute before running this example
    # See the function definition for more info
    spec.before = [fixtures.fakeSports]

    # Request this resource with specific parameters
    # This is a "supertest" request, so you can use any "superagent" functions
    # For example set request headers, add attachements...
    spec.request = agent.get('/sports')
                        .set('Accept', 'application/json')

    # Expected response
    # The status and body should be an exact match
    # But it's OK to have extra response headers not specified here
    spec.response =
      status: 200
      headers:
        'Content-Type': /json/
      body:
        sports: [
          { id: 1, name: 'Soccer' }
          { id: 2, name: 'Tennis' }
        ]


  # Another sample for a different resource (competitions)
  api.sample (spec, agent) ->

    spec.group = 'Events / Competitions'
    spec.name  = 'Competitions by sport'
    spec.summary  =
      '''
      - List of **open** competitions for a given sport.
      - Returns all countries by default.    
      '''

    spec.before = [fixtures.fakeSports]

    spec.request = agent.get('/sports/1/competitions')
                        .set('Accept', 'application/json')

    spec.response =
      status: 200
      headers:
        'Content-Type': /json/
      body:
        competitions: [
          { id: 1, country: 'gb', name: 'English premier league' }
          { id: 2, country: 'fr', name: 'Coupe de France' }
        ]


  # One more sample, reusing the same level 2 grouping
  api.sample (spec, agent) ->

    spec.group = 'Events / Competitions'
    spec.name  = 'Filter by country'
    spec.summary =
      '''
      - Only get competitions for a given country
      - Uses the official ISO [country codes](http://en.wikipedia.org/wiki/ISO_3166-1)
      '''

    spec.before = [fixtures.fakeSports]

    spec.request = agent.get('/sports/1/competitions?country=fr')
                        .set('Accept', 'application/json')

    spec.response =
      status: 200
      headers:
        'Content-Type': /json/
      body:
        competitions: [
          { id: 2, country: 'fr', name: 'Coupe de France' }
        ]

