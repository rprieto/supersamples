# HTML renderer

You can specify the following in your `supersamples.opts`:

```json
{

  "renderers": {

    "html": {

      // Relative path to the output folder
      "outputFolder": "path/to/output"

      // Renderer options
      "title": "My API docs",
    
      // Optional Markdown document used at the top of the docs
      // Heading levels 1 and 2 are appended to the navigation
      "intro": "tests/intro.md",
    
      // Extra files to be copied into the output folder (css, logos, htaccess...)
      // <key> is a glob pattern to a list of files
      // <value> is the target folder inside of the configured output
      "files": {
        "tests/extra/**": "."
      },
    
      // Paths to custom CSS files, to override the default styles
      // These must have been copied as part of "files"
      "styles": [
        "custom.css"
      ]

    }

  }

}
```

See a live example of the HTML output [over here](http://rprieto.github.io/supersamples).

<a href="http://rprieto.github.io/supersamples"><img src="https://raw.github.com/rprieto/supersamples/master/thumbnail.png" /></a>
