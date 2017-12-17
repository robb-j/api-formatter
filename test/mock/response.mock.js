
/**
 * A mock of express.Response
 * @type {ResponseMock}
 */
module.exports = class ResponseMock {
  
  /** Sets up the mock */
  constructor() {
    this.sentStatus = null
    this.sentBody = null
  }
  
  /** Set the status */
  status(status) {
    this.sentStatus = status
    return this
  }
  
  /** Send a response body */
  send(body) {
    this.sentBody = body
    return this
  }
}
