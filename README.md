> Collection of samples for your Node.js REST API

![logo](https://raw.github.com/rprieto/supersamples/master/logo.png)

`supersamples` is a [Mocha](https://github.com/visionmedia/mocha) reporter that understands [Supertest](https://github.com/visionmedia/supertest) to generate reliable and up-to-date API samples. In a nutshell:

- define concrete request/response examples in your test suite
- if you need to, use mocks to make sure you control the API reponses
- get high-level HTML documentation that's always up-to-date!

See a live example [over here](http://rprieto.github.io/supersamples).

*Works with any Node.js `http.Server`, like [Express](https://github.com/visionmedia/express) or [Restify](https://github.com/mcavage/node-restify)*

## So what does the code look like?

Nothing special! Simply use `supertest` in your test suite, and `supersamples` will generate the request/response documentation for you!

```coffee
it '''
# Get list of sports
- list is ordered alphabetically
- doesn't return sports with no active competitions
''', (done) ->

  request(server)
    .get('/sports')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(
      sports: [
        { id: 1, name: 'Soccer' }
        { id: 2, name: 'Tennis' }
      ]
    )
    .end(done)
```

*Note:* to reduce clutter, `supersamples` will only output the reponse headers if they were asserted on.

## How do I set it up?

```
npm install supersamples --save
```

Then wire up `supersamples` at the top of your spec file:

```js
var request = require('supertest');
require('supersamples').instrument(request);
```

Finally have a look at the [example folder](http://github.com/rprieto/supersamples/blob/master/example). You can add tests to the usual `test` folder, or keep them separate if you want. Simply run Mocha with the provided reporter:

```bash
./node_modules/.bin/mocha --reporter supersamples path/to/tests
```

You can specify documentation options in a separate **supersamples.opts** file at the root:

```json
{
  "title": "My API docs",
  "intro": "tests/intro.md",
  "styles": ["tests/custom.css"],
  "output": "docs"
}
```

## What doesn't it do?

`supersamples` DOES NOT provide a way to describe every path or query string parameter. It's meant to give you reliable but low-cost API samples. If you want a very detailled API description, you might like other tools better:

&nbsp;&nbsp;&nbsp;&nbsp;- tools like [Apiary](http://apiary.io) or [ApiDoc](http://apidocjs.com) let you document your API in text-format (for example Markdown or JavaScript comments). Just remember to keep these up to date!

&nbsp;&nbsp;&nbsp;&nbsp;- tools like [Swagger](http://developers.helloreverb.com/swagger/) provide a JavaScript API to define your routes. It can generate docs that are always up-to-date, if you don't mind using their syntax instead of vanilla Express or Restify.

## Contributing

Issues & pull requests welcome.

To work on the project locally, simply run:

```bash
# install dependencies
npm install

# allow supersamples to require itself
npm link
npm link supersamples

# run the unit tests
npm test

# build the sample docs
make clean example
```
