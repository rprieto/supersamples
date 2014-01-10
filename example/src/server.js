var express = require('express');
var controller = require('./controller');

var server = express();
server.use(express.json());
server.use(express.urlencoded());

//
// Our main 3 routes
//

server.get('/status', controller.getStatus);
server.get('/sports', controller.getSports);
server.get('/sports/:id/competitions', controller.getCompetitions);
server.post('/tickets', controller.buyTickets);
server.del('/tickets/:id', controller.cancelTicket);

module.exports = server;
