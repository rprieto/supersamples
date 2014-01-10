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

    # Docs are nested in a typical breadcrumbs structure
    # The creadcrumbs are collated and merged across all test files
    spec.nav  = 'API / Information / Sports'

    # Unique name to identify this example
    spec.name = 'Get list of sports'

    # Optional summary in Markdown format
    # Keep it short so it doesn't need much maintenance
    spec.summary =
      '''
      Get the full list of sports:

      - ordered alphabetically
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


  # Another sample
  # For a different resource
  api.sample (spec, agent) ->

    spec.nav  = 'API / Information / Competitions'
    spec.name = 'Competitions by sport'
    spec.summary =
      '''
      - List of open competitions for a given sport.
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


  # One more
  # Reusing the same "nav" to by grouped with similar samples
  api.sample (spec, agent) ->

    spec.nav  = 'API / Information / Competitions'
    spec.name = 'Filter by country'
    spec.summary =
      '''
      - Only get competitions for a given country.
      - Uses the official ISO [country codes](http://en.wikipedia.org/wiki/ISO_3166-1).
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

