require('./lib/instrument').setup();

try {
  module.exports = require('./lib/reporter');
} catch (ex) {
  console.error('Failed to create Mocha reporter\n');
  console.error(ex.stack);
  process.exit(1);
}
