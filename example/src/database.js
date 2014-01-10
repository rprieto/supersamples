var _ = require('lodash');

//
// Let's assume we can't rely on the data
// So that's no good for automated testing
//

function id() {
  return _.random(1,999);
}

function letter() {
  return 'abcdefghijklmnopqrstuvwxyz'.substr(_.random(0,25),1);
}

function string(len) {
  return _.times(len, letter).join('');
}

var sports = [
  {
    id: id(),
    name: string(5),
    competitions: [
      { id: id(), country: string(2), name: string(10) },
      { id: id(), country: string(2), name: string(10) }
    ]
  },
  {
    id: id(),
    name: string(5),
    competitions: [
      { id: id(), country: string(2), name: string(10) },
      { id: id(), country: string(2), name: string(10) }
    ]
  }
];


//
// For simplicity reasons, the example has a synchronous database
// Of course everything would still be testable/mockable with asyncronous calls
//

exports.getSports = function () {
  return sports;
};

exports.buyTickets = function (competitionId, quantity) {
  var ticketNumbers = [];
  for (var i = 0; i < quantity; ++i) {
    ticketNumbers.push('ticket' + id());
  }
  return ticketNumbers;
};

