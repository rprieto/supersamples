clean:
	@rm -rf example/output

# no dependencies, just run it every time
example:
	@node ./bin/swatch --input example/api_tests --output example-docs

# shortcut to open the example output
open:
	open example-docs/index.html

# deploy the example docs to https://github.com/rprieto/api-swatch
deploy:
	git subtree push --prefix example-docs origin gh-pages

.PHONY: clean example open deploy
