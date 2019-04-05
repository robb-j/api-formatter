'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class MetaBlock {
  constructor(success, messages, status, api) {
    this.success = success
    this.messages = typeof messages === 'string' ? [messages] : messages
    this.status = status
    this.name = api.name
    this.version = api.version
  }
}
exports.MetaBlock = MetaBlock
/** A class for creating a json envelope for sending api responses */
class Api {
  /** Creates an express middleware that adds req.api & res.api instances */
  // static middleware(name: string = null, version: string = null) {
  static middleware(options) {
    return (req, res, next) => {
      let api = new this(req, res, options)
      req.api = api
      res.api = api
      next()
    }
  }
  /** Creates a new Api instance from an Express responses */
  constructor(req, res, options = {}) {
    this.req = req
    this.res = res
    this.name = options.name || process.env.npm_package_name || undefined
    this.version =
      options.version || process.env.npm_package_version || undefined
    this.httpFail = options.httpFail === undefined ? true : options.httpFail
  }
  /** Sends an api failure */
  sendFail(messages, status) {
    status = this.pickStatusCode(status)
    this.res
      .status(status)
      .send(this.makeEnvelope(false, messages, status, null))
  }
  /** Sends a data response */
  sendData(data, status = 200) {
    this.res.status(status).send(this.makeEnvelope(true, [], status, data))
  }
  /** Catches errors and sends the message as a sendFail */
  async catch(block, hook) {
    try {
      await block(this)
    } catch (error) {
      if (hook) hook(error, this)
      this.sendFail(error.message)
    }
  }
  pickStatusCode(status) {
    return status === undefined ? (this.httpFail ? 400 : 200) : status
  }
  makeEnvelope(success, messages, status, data) {
    return {
      meta: new MetaBlock(success, messages, status, this),
      data
    }
  }
}
exports.Api = Api
//# sourceMappingURL=index.js.map
