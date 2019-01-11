# 
# See "events.coffee" for detailled comments
#

request  = require 'supertest'
server   = require '../src/server'

describe 'Admin', ->

  describe 'Reporting', ->

    it '''
       Status check

       Health check route to check the status of all downstreams system.
       ''', () ->

       request(server)
       .get('/status')
       .set('Accept', 'application/json')
       .expect(200)
       .expect('Content-Type', /json/)
       .expect(status: 'OK')
