# Api Middleware
[![CircleCI](https://circleci.com/gh/robb-j/api-formatter.svg?style=svg)](https://circleci.com/gh/robb-j/api-formatter)

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

## A Full example

```ts
import express from 'express'
import { Api } from 'api-formatter'

let app = express()

app.use(Api.middleware({ name: 'dogs-api', version: 'v1' }))

app.get('/', (req, res) => {
  res.api.sendData({ msg: 'Hey!' })
})

app.get('/error', (req, res) => {
  res.api.sendFail(['Oops, something went wrong :S'])
})

app.listen(3000, () => console.log('Listening on :3000'))
```

The success response will be:

> `GET http://localhost:3000` → http/200

```json
{
  "meta": {
    "success": true,
    "messages": [],
    "status": 200,
    "name": "dogs-api",
    "version": "v1"
  },
  "data": { "msg": "Hey!" }
}
```

And the fail response will be:

> `GET http://localhost:3000/error` → http/400

```json
{
  "meta": {
    "success": false,
    "messages": ["Oops, something went wrong :S"],
    "status": 400,
    "name": "dogs-api",
    "version": "v1"
  },
  "data": null
}
```
