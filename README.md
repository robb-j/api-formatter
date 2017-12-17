# Api Middleware
A utility to send formatted json responses as an express response

## Usage

```js

const express = require('express')
const Api = require('api-formatter')

let app = express()


// Register the middleware
app.use(Api.middleware('My Fancy Api', '0.1.2'))

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
  req.api.catchErrors(api => {
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
    "messages": [
      "Something went wrong :S"
    ],
    "name": "My Fancy Api",
    "version": "0.1.2"
  },
  "data": null
}
```
