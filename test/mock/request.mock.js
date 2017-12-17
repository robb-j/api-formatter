
/**
 * A mock of express.Request
 * @type {RequestMock}
 */
module.exports = class RequestMock {
  
  /** Sets up the mock */
  constructor(query = {}, body = {}) {
    this.query = query
    this.body = body
  }
}
