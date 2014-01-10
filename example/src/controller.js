var _ = require('lodash');
var database = require('./database');

exports.getStatus = function (req, res) {
  res.send(200, {status: 'OK'});
};

exports.getSports = function (req, res) {
  var sports = database.getSports().map(function (s) {
    return { id: s.id, name: s.name };
  });
  res.send(200, {sports: sports});
};

exports.getCompetitions = function (req, res) {
  var sportId = parseInt(req.params.id, 10);
  var country = req.query.country;
  var sport = _.find(database.getSports(), {id: sportId});
  if (!sport) {
    res.send(404, 'Sport ' + sportId + ' does not exist');
  } else {
    res.send(200, {
      competitions: sport.competitions.filter(function (c) {
        return country ? (c.country === country) : true;
      })
    });
  }
};

exports.buyTickets = function (req, res) {
  var competitionId = req.body.competitionId;
  var quantity = req.body.quantity;
  var sports = database.getSports();
  var comp = _(sports).pluck('competitions').flatten().find({id: competitionId});
  if (!comp) {
    res.send(404, 'Competition ' + competitionId + ' does not exist');
  } else {
    var tickets = database.buyTickets(competitionId, quantity);
    res.send(201, {
      eventName: comp.name,
      tickets: tickets
    });
  }
};

exports.cancelTicket = function (req, res) {
  res.send(204);
};
