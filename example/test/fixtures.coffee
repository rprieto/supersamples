#
# Helper functions and test fixtures
# These won't appear anywhere in the docs
#
# Here we just stub out database calls,
# but we could just as well load fixtures into an actual database
# or stub out any back-end service calls
#

database = require '../src/database'


exports.fakeSports = (sandbox) ->
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

exports.successfulPurchase = (sandbox) ->
  sandbox.stub database, 'buyTickets', (competitionId, quantity) ->
    ['ticket1', 'ticket2', 'ticket3']
