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
      "version": 2,
      
      // Generate a postman test suite
      "generateTests": true,

      // Replacing options
      /*
        you can specify which values in 'headers' and 'body' of requests to replace
        this can be useful e.g. if you want to replace some values with postman variables in your collection
        the values will be replaced for all requests that have matching keys in either headers or body
        if you need to remove the value - just set it to `null`
      */
      "replace": {
        "headers": {
          "authtoken": "{{variable}}",
          "secret": null // will be removed from all requests
        },
        "body": {
          "someBodyParam": "yourValue"
        }
      },

      // Additional postman items
      /*
        you can specify additional items that will be appended to the collection after generated requests
        this can be useful if you want to add requests that are not covered by your tests (e.g. auth requests, etc.)
      */
      "additionalItems": [
        {
          "name": "Item name",
          "event": [],
          "request": {
            "url": "{{baseUrl}}",
            "method": "GET",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{}"
            },
            "description": ""
          },
          "response": []
        }
      ]

    }

  }

}
```

Which will generate a postman collection
