# Api Middleware

A utility to send formatted json responses as an express response

## Usage

```js
const express = require('express')
const Api = require('api-formatter').Api

let app = express()

// Register the middleware
app.use(Api.middleware({ name: 'My Fancy Api' }))

// Sending formatted data
app.get('/', (req, res) => {
  res.api.sendData({ something: 'cool!' })
})

// Sending a formatted failure
app.get('/wip', (req, res) => {
  res.api.sendFail('Not implemented yet', 418)
})

// Automatically catching errors
app.get('/bad', (req, res) => {
  req.api.catch(api => {
    throw new Error('Something went wrong :S')
  })
})
```

#### Success Response, HTTP 200

```json
{
  "meta": {
    "success": true,
    "messages": [],
    "name": "My Fancy Api",
    "version": "0.1.2"
  },
  "data": {
    "something": "cool!"
  }
}
```

#### Failure Response, HTTP 400

```json
{
  "meta": {
    "success": false,
    "messages": ["Something went wrong :S"],
    "name": "My Fancy Api",
    "version": "0.1.2"
  },
  "data": null
}
```

## Middleware options

| Name        | Use                                                                  |
| ----------- | -------------------------------------------------------------------- |
| `name`      | The name of your api, defaults to your `package.json` name           |
| `version`   | The version of your api, defaults to your `package.json` version     |
| `httpError` | Whether a failed response should return a HTTP/400, defaults to true |
