# 
# See "information.coffee" for detailled comments
# about the formats & conventions
#

swatch  = require 'api-swatch'
server  = require '../src/server'


swatch server, (api) ->


  api.sample (spec, agent) ->

    spec.nav  = 'API / Information'
    spec.name = 'Status page'
    spec.summary =
      '''
      Health check route to check the status of all downstreams system.
      '''

    spec.request = agent.get('/status')
                        .set('Accept', 'application/json')

    spec.response =
      status: 200
      headers:
        'Content-Type': /json/
      body: 
        status: 'OK'
