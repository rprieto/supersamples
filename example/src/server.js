var restify = require('restify');
var controller = require('./controller');

var server = restify.createServer();
server.use(restify.plugins.bodyParser({
    "mapParams": false,
}))
server.use(restify.plugins.queryParser({
    "mapParams": false,
}))

//
// Our main 3 routes
//

server.get('/status', controller.getStatus);
server.get('/sports', controller.getSports);
server.get('/sports/:id/competitions', controller.getCompetitions);
server.post('/tickets', controller.buyTickets);
server.del('/tickets/:id', controller.cancelTicket);
server.post('/account/verify', controller.verifyAccount);

module.exports = server;