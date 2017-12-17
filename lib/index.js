
/**
 * A utility for sending formatted api responses for an express server
 * @type {Api}
 */
module.exports = class Api {
  
  /**
   * Generates a middleware to automatically make an api and add it to the request & response for use
   * @param  {string} [name=null]    The name of the Api
   * @param  {string} [version=null] The version of the api
   * @return {express.middleware}
   */
  static middleware(name = null, version = null) {
    return (req, res, next) => {
      let api = new this(req, res, name, version)
      req.api = api
      res.api = api
      next()
    }
  }
  
  
  
  /**
   * Creates an new Api object
   * @param  {express.Request} req   The request object
   * @param  {express.Response} res  The response object
   * @param  {string} [name=null]    The name of your API
   * @param  {string} [version=null] The version of your API
   * @return {Api}
   */
  constructor(req, res, name = null, version = null) {
    this.req = req
    this.res = res
    this.name = name
    this.version = version
  }
  
  /** [internal] Makes the meta portion of the body */
  makeMetaBlock(isSuccessful, messages, status) {
    return {
      success: isSuccessful,
      messages: Array.isArray(messages) ? messages : [messages],
      name: this.name || undefined,
      version: this.version || undefined
    }
  }
  
  /**
   * Sends a failure response to the response
   * @param  {string|string[]} messages The message(s) to send
   * @param  {Number} [status=400]      The http status to send
   */
  sendFail(messages, status = 400) {
    this.res.status(status).send({
      meta: this.makeMetaBlock(false, messages, status),
      data: null
    })
  }
  
  /**
   * Sends data to the response
   * @param  {object} data         The data to send
   * @param  {Number} [status=200] The http status
   */
  sendData(data, status = 200) {
    this.res.status(status).send({
      meta: this.makeMetaBlock(true, [], status),
      data: data
    })
  }
  
  /**
   * A utility to catch errors and send an api failure
   * @param  {function}  asyncBlock       The block to call
   * @param  {function}  [errorHook=null] An optional hook when an error occurs
   */
  async catchErrors(asyncBlock, errorHook = null) {
    try {
      await asyncBlock(this)
    }
    catch (error) {
      if (errorHook) errorHook(error, this)
      this.sendFail(error.message)
    }
  }
}
