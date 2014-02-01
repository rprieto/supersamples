var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var handlebars  = require('handlebars');
var markit      = require('markit');
var statusCodes = require('http-status-codes');
var hljs        = require('highlight.js');
var slug        = require('./slug');


var PARTIALS = path.join(__dirname, '..', '..', 'template', 'partials');
var partials = fs.readdirSync(PARTIALS);

partials.forEach(function(filename) {
  var name = path.basename(filename, '.hbs');
  var source = fs.readFileSync(path.join(PARTIALS, filename)).toString();
  handlebars.registerPartial(name, source);
});

// Render Markdown
// And prepend a named anchor before all H1 headings
handlebars.registerHelper('markdown', function(text) {
  var r = new markit.Renderer();
  r.header = function(text, level) {
    var anchor  = '<a name="' + slug.from(text) + '"></a>';
    var heading = '<h' + level + '>' + text + '</h' + level + '>';
    return new handlebars.SafeString(anchor + '\n' + heading);
  };
  r.blockcode = function(code, language) {
    var str;
    if (language) {
      str = hljs.highlight(language, code).value;
    } else {
      str = hljs.highlightAuto(code).value;
    }
    return new handlebars.SafeString('<pre><code>' + str + '</code></pre>');
  };
  var rendered = markit(text, {renderer: r});
  return new handlebars.SafeString(rendered);
});

handlebars.registerHelper('hasKeys', function(value, options) {
  if (value && Object.keys(value).length > 0) {
    return options.fn(this);
  }
});

handlebars.registerHelper('headers', function(headers) {
  var concat = _.reduce(headers, function(acc, val, key) {
    return acc + key + ': ' + val + '\n';
  }, '');
  var str = hljs.highlight('http', concat).value;
  return new handlebars.SafeString('<pre><code>' + str + '</code></pre>');
});

handlebars.registerHelper('json', function(obj) {
  if (obj) {
    var json = JSON.stringify(obj, null, '  ');
    var str = hljs.highlight('json', json).value;
    return new handlebars.SafeString('<pre><code>' + str + '</code></pre>');
  } else {
    return '';
  }
});

handlebars.registerHelper('code', function(string) {
  if (string) {
    var highlighted = hljs.highlightAuto(string).value;
    return new handlebars.SafeString('<pre><code class="wrap">' + highlighted + '</code></pre>');
  } else {
    return '';
  }
});

handlebars.registerHelper('httpVerb', function(method) {
  return (method === 'DELETE') ? 'DEL' : method;
});

handlebars.registerHelper('httpStatus', function(code) {
  if (code == null) return '';
  return code + ' ' + statusCodes.getStatusText(code);
});
