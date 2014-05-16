var _            = require('lodash');
var fs           = require('fs');
var path         = require('path');
var handlebars   = require('handlebars');
var markit       = require('markit');
var statusCodes  = require('http-status-codes');
var hljs         = require('highlight.js');
var slug         = require('./slug');
var customLang   = require('./highlight_lang');


var PARTIALS = path.join(__dirname, 'templates', 'partials');
var partials = fs.readdirSync(PARTIALS);

partials.forEach(function(filename) {
  var name = path.basename(filename, '.hbs');
  var source = fs.readFileSync(path.join(PARTIALS, filename)).toString();
  handlebars.registerPartial(name, source);
});

//
// Highlight JS custom languages
//

hljs.registerLanguage('tokens', function() {
  return customLang.tokens;
});

//
// Render Markdown
// And prepend a named anchor before all H1 headings
//

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

//
// Specific helpers
//

handlebars.registerHelper('hasKeys', function(value, options) {
  if (value && Object.keys(value).length > 0) {
    return options.fn(this);
  }
});

handlebars.registerHelper('httpStatus', function(code) {
  if (!code) return '';
  return code + ' ' + statusCodes.getStatusText(code);
});

handlebars.registerHelper('httpVerb', function(method) {
  return (method === 'DELETE') ? 'DEL' : method;
});


//
// Syntax highlighting
//

handlebars.registerHelper('code', function(string) {
  if (!string) return '';
  return code(string, false);
});

handlebars.registerHelper('code-auto', function(string, lang) {
  if (!string) return '';
  return highlight(string, true, null);
});

handlebars.registerHelper('code-tokens', function(url) {
  return highlight(url, false, 'tokens');
});

handlebars.registerHelper('code-json', function(obj) {
  if (!obj) return '';
  var json = JSON.stringify(obj, null, '  ');
  return highlight(json, false, 'json');
});

handlebars.registerHelper('code-headers', function(headers) {
  var concat = _.reduce(headers, function(acc, val, key) {
    return acc + key + ': ' + val + '\n';
  }, '');
  return highlight(concat, false, 'http');
});


function highlight(string, wrap, lang) {
  if (lang) {
    var html = hljs.highlight(lang, string).value;
  } else {
    var html = hljs.highlightAuto(string).value;
  }
  return code(html, wrap);
}

function code(string, wrap) {
  var before = wrap ? '<pre><code class="wrap">' : '<pre><code>';
  var after = '</code></pre>';
  return new handlebars.SafeString(before + string + after);
}
