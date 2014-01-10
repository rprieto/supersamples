var handlebars  = require('handlebars');
var markdown    = require('markdown').markdown;
var statusCodes = require('http-status-codes');


handlebars.registerHelper('markdown', function(text) {
  var rendered = markdown.toHTML(text);
  return new handlebars.SafeString(rendered);
});

handlebars.registerHelper('json', function(obj) {
  var str = JSON.stringify(obj, null, '  ');
  return new handlebars.SafeString(str);
});

handlebars.registerHelper('httpStatus', function(code) {
  return code + ' ' + statusCodes.getStatusText(code);
});
