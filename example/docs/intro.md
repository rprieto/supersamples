# Intro

This is a sample API that doesn't do much.
It has:

- several resources
- a mix of HTTP verbs
- up to date documentation :)

## Event information

All informational resources are cacheable by proxies or on the client-side. These routes are public, and there is no rate-limiting.

## Authenticated calls

You need to pass your custom API token as a request header:

```
X-API-Token: 76ac098ef08d61b824a
```
