# Postman renderer

You can specify the following in your `supersamples.opts`:

```js
{

  "renderers": {

    "postman": {

      // Relative path to the output file
      "outputFile": "path/to/file.postman_collection",
      
      // Collection title
      "title": "Postman Collection Title"

      // Format version (optional) - currently only postmanV2 is supported
      "version": 2

    }

  }

}
```

Which will generate a postman collection
