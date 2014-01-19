# 
# See "information.coffee" for detailled comments
# about the formats & conventions
#

swatch  = require 'api-swatch'
server  = require '../src/server'
fixtures = require './fixtures'


swatch server, (api) ->

  api.sample (spec, agent) ->

    spec.group = 'User / Tickets'
    spec.name  = 'Buying tickets'
    spec.summary =
      '''
      This is an **authenticated** call.

      - you can purchase multiple tickets at once
      - keep your ticket numbers somewhere safe
      '''

    spec.before = [fixtures.fakeSports, fixtures.successfulPurchase]

    spec.request = agent.post('/tickets')
                        .send(competitionId: 4, quantity: 3)
                        .set('Accept', 'application/json')

    spec.response =
      status: 201
      headers:
        'Content-Type': /json/
      body:
        eventName: 'Australian Open'
        tickets: ['ticket1', 'ticket2', 'ticket3']

  api.sample (spec, agent) ->

    spec.group = 'User / Tickets'
    spec.name  = 'Cancelling a ticket'
    spec.summary =
      '''
      This is an **authenticated** call.
      
      - your account will be re-credited with the amount
      '''

    spec.before = []

    spec.request = agent.del('/tickets/123')
                        .set('Accept', 'application/json')

    spec.response =
      status: 204
      headers: {}
      body: {}

