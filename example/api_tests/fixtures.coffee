#
# Helper functions and test fixtures
# These won't appear anywhere in the docs
# Here we just just the Sinon sandbox to stub out database calls
# We could just as well load fixtures into an actual database
# Or stub out any back-end service calls
#

sinon    = require 'sinon'
database = require '../src/database'


# "before" methods get passed a sinon sandbox (http://sinonjs.org/docs/#sinon-sandbox)
# you can use it to setup temporary stub in the context of a single test
exports.fakeSports = (sandbox, done) ->
  sandbox.stub database, 'getSports', -> [
    {
      id: 1,
      name: 'Soccer',
      competitions: [
        { id: 1, country: 'gb', name: 'English premier league' }
        { id: 2, country: 'fr', name: 'Coupe de France' }
      ]
    }
    {
      id: 2,
      name: 'Tennis',
      competitions: [
        { id: 3, country: 'us', name: 'US Open' }
        { id: 4, country: 'au', name: 'Australian Open' }
      ]
    }
  ]
  done()


exports.successfulPurchase = (sandbox, done) ->
  sandbox.stub database, 'buyTickets', (competitionId, quantity) ->
    ['ticket1', 'ticket2', 'ticket3']
  done()

