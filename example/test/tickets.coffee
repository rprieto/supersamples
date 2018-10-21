# See "events.coffee" for detailled comments

request  = require 'supertest'
sinon    = require 'sinon'
path     = require 'path'
server   = require '../src/server'
fixtures = require './fixtures'
sandbox  = null

describe 'User', ->

  describe 'Tickets', ->

    beforeEach ->
      sandbox = sinon.sandbox.create()
      fixtures.fakeSports(sandbox)
      fixtures.successfulPurchase(sandbox)

    afterEach ->
      sandbox.restore()

    it '''
       Buying tickets

       - this is an **authenticated** call
       - you can purchase multiple tickets at once
       - keep your ticket numbers somewhere safe
       ''', () ->

       request(server)
       .post('/tickets')
       .send(competitionId: 4, quantity: 3)
       .set('Accept', 'application/json')
       .expect(201)
       .expect('Content-Type', /json/)
       .expect(
         eventName: 'Australian Open'
         tickets: ['ticket1', 'ticket2', 'ticket3']
       )


    it '''
       Cancelling a ticket

       - this is an **authenticated** call
       - your account will be re-credited with the amount
       ''', () ->

       request(server)
       .del('/tickets/123')
       .set('Accept', 'application/json')
       .expect(204)
       .expect({})


    it '''
       Some sports events require proof of ID for purchase.
       Before purchasing a ticket, you will need to upload
       your ID for automated verification.
       ''', () ->

       request(server)
       .post('/account/verify')
       .set('Accept', 'application/json')
       .attach('id', path.join(__dirname, 'license.jpg'), 'license.jpg')
       .expect(200)
       .expect(verificationStatus: 'pending')
