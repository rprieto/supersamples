var shim = require('./lib/shim');

console.log('');
shim.register('superagent', require('./lib/instruments/superagent'));
shim.register('supertest', require('./lib/instruments/supertest'));
shim.register('restify', require('./lib/instruments/restify'));

module.exports = require('./lib/reporter');
