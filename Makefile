clean:
	@rm -rf example/output

# no dependencies, just run it every time
example:
	@node ./bin/swatch --input example/api_tests --output example/output

# shortcut to open the example output
open:
	open example/output/index.html

.PHONY: clean example open
