# JSON renderer

You can specify the following in your `supersamples.opts`:

```json
{

  "renderers": {

    "json": {

      // Relative path to the output file
      "outputFile": "path/to/file.json"

    }

  }

}
```

Which will generate the following file format:

```json
[
  {
    "id": 5,
    "summary": "Cancelling a ticket\n\n- this is an **authenticated** call\n- your account will be re-credited with the amount",
    "hierarchy": [
      "User",
      "Tickets",
      "Cancelling a ticket"
    ],
    "request": {
      "headers": {
        "accept": "application/json"
      },
      "method": "DELETE",
      "path": "/tickets/123",
      "route": "/tickets/:id"
    },
    "response": {
      "status": 204,
      "headers": {},
      "body": ""
    },
    "snippets": {
      "curl": "curl -X DELETE -H \"accept: application/json\" \"http://my-api.com/tickets/123\""
    }
  },
  {
    // ...
  }
]
```
