
# api-swatch

> Collection of samples for your REST API

![logo](https://raw.github.com/rprieto/api-swatch/master/media/logo.png)

*Works with any `http.Server`, like [Express](https://github.com/visionmedia/express) or [Restify](https://github.com/mcavage/node-restify)*

- define request/response examples for your API
- run them against mocks as part of your test suite
- generate HTML documentation from them

<a href="https://raw.github.com/rprieto/api-swatch/master/media/output.png">
  <img src="https://raw.github.com/rprieto/api-swatch/master/media/output-thumbnail.png" alt="generated document example" />
</a>

## What exactly does it do?

- It builds on top of [mocha](https://github.com/visionmedia/mocha), [supertest](https://github.com/visionmedia/supertest), and [sinon](http://sinonjs.org) to have **executable documentation**. In fact, generating the HTML documents requires running the tests, so your docs are never out of date.

```bash
  Events
    Sports
      ✓ Get list of sports
    Competitions
      ✓ Competitions by sport
      ✓ Filter by country

  Admin
    Reporting
      ✓ Status check

  User
    Tickets
      ✓ Buying tickets
      ✓ Cancelling a ticket


  6 passing (26ms)

Docs generated in example/output
```

- `api-swatch` focusses on **concrete request/response examples**. This doesn't give a full-comprehensive output describing every parameter, but it creates high-level documentation people can understand at a glance

- since it actually `requires()` your HTTP server, you can stub out any of its dependencies to make sure you control your test fixtures - while still exercising all the API parts that matter.

- you can add any [Markdown](daringfireball.net/projects/markdown/) text at the start of documentation, and alongside every sample.

## What doesn't it do?

`api-swatch` DOES NOT provide a way to describe every path or query string parameter. If you want a very detailled API description, you might like other tools better:

&nbsp;&nbsp;&nbsp;&nbsp;- tools like [Apiary](http://apiary.io) or [ApiDoc](http://apidocjs.com) let you document your API in text-format (for example Markdown or JavaScript comments). Just remember to keep these up to date!

&nbsp;&nbsp;&nbsp;&nbsp;- tools like [Swagger](http://developers.helloreverb.com/swagger/) provide a JavaScript API to define your routes. It can generate docs that are always up-to-date, if you don't mind using their syntax instead of vanilla Express or Restify.

## How do I set it up?

In your project folder:

```
npm install api-swatch --save
```

Then add a new folder for your tests, for example:

```
|__ myproject
   |__package.json
   |__src
   |__test
   |__api_tests   <<<<< here
```

Have a look at the [example](http://github.com/rprieto/api-swatch/blob/master/example) to create your first test. Then run `swatch` as part of your build pipeline, so you get fresh docs every time you build your project.

```bash
# run your normal unit tests
./node_modules/.bin/mocha

# and run/generate your docs
./node_modules/.bin/swatch --input api_tests --output output_docs --intro introduction.md
```

## Contributing

Issues & pull requests welcome.

To work on the project locally, simply run:

```bash
# install dependencies
npm install

# allow the sample code to require itself
npm link
npm link api-swatch

# run the unit tests
npm test

# build the sample docs
make clean example
```
