
# node modules
node_modules: package.json
	@npm install

# delete all generated files
clean:
	@rm -rf example-docs

# generate the docs from the Mocha tests
example-docs: example lib supersamples.opts node_modules
	@node_modules/.bin/mocha --compilers coffee:coffee-script/register --reporter supersamples example/test

# shortcut to open the generated website
open:
	open example-docs/index.html

# deploy the example HTML docs to http://rprieto.github.io/supersamples/
deploy: example-docs
	git commit example-docs -m "Regenerate example docs"
	git subtree split --prefix example-docs -b gh-pages
	git push -f origin gh-pages:gh-pages
	git branch -D gh-pages

.PHONY: clean open deploy
