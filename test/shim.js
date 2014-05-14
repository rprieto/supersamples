var shim = require('../lib/shim');

shim.register('superagent', require('../lib/instruments/superagent'));
shim.register('supertest', require('../lib/instruments/supertest'));
