var restify = require('restify');
var controller = require('./controller');

var server = restify.createServer();
server.use(restify.bodyParser({"mapParams": false}))
server.use(restify.queryParser({"mapParams": false}))

//
// Our main 3 routes
//

server.get('/status', controller.getStatus);
server.get('/sports', controller.getSports);
server.get('/sports/:id/competitions', controller.getCompetitions);
server.post('/tickets', controller.buyTickets);
server.del('/tickets/:id', controller.cancelTicket);

module.exports = server;