clean:
	@rm -rf example-docs/**

# run the "example" tests with the api-swatch reporter
example:
	@node_modules/.bin/mocha --compilers coffee:coffee-script --reporter supersamples example/test

# shortcut to open the generated example docs
open:
	open example-docs/index.html

# deploy the example docs to https://github.com/rprieto/api-swatch
deploy:
	git subtree push --prefix example-docs origin gh-pages

.PHONY: clean example open deploy
