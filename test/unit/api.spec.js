
const expect = require('chai').expect
const { Api, MetaBlock } = require('../../lib')

const RequestMock = require('../mock/request.mock')
const ResponseMock = require('../mock/response.mock')

const defaultOpts = {
  name: 'Name', version: '0.1.0'
}

describe('Api', function() {
  
  let req, res
  beforeEach(async function() {
    req = new RequestMock()
    res = new ResponseMock()
  })
  
  describe('.middleware', async function() {
    let middleware = Api.middleware({ name: 'Name', version: '0.1.0' })
    
    it('should add an api to the request', async function() {
      middleware(req, res, () => {})
      expect(req.api).to.be.instanceof(Api)
    })
    it('should add an api to the response', async function() {
      middleware(req, res, () => {})
      expect(res.api).to.be.instanceof(Api)
    })
    it('should set the api name', async function() {
      middleware(req, res, () => {})
      expect(req.api.name).to.equal('Name')
    })
    it('should set the api version', async function() {
      middleware(req, res, () => {})
      expect(req.api.version).to.equal('0.1.0')
    })
    it('should call next', async function() {
      let called = false
      middleware(req, res, () => { called = true })
      expect(called).to.equal(true)
    })
  })
  
  describe('#constructor', function() {
    it('should make an instance', async function() {
      let api = new Api(req, res, defaultOpts)
      
      expect(api.req).to.equal(req)
      expect(api.res).to.equal(res)
      expect(api.name).to.equal('Name')
      expect(api.version).to.equal('0.1.0')
    })
  })
  
  describe('#sendFail', function() {
    
    it('should format a fail', async function() {
      let api = new Api(req, res, defaultOpts)
      api.sendFail('message')
      
      expect(res.sentBody).to.exist
      expect(res.sentBody).to.have.property('meta')
      expect(res.sentBody.meta).to.have.property('success', false)
      expect(res.sentBody).to.have.property('data', null)
      expect(res.sentStatus).to.equal(400)
    })
    
    it('should set the status code', async function() {
      let api = new Api(req, res, defaultOpts)
      api.sendFail('auth fail', 401)
      expect(res.sentStatus).to.equal(401)
    })
    
    it('should 200 if httpFail is false', async function() {
      let opts = Object.assign({ httpFail: false }, defaultOpts)
      let api = new Api(req, res, opts)
      
      api.sendFail('message')
      expect(res.sentStatus).to.equal(200)
    })
  })
  
  describe('#sendData', function() {
    
    it('should format a success', async function() {
      let api = new Api(req, res, defaultOpts)
      api.sendData('some_data')
      
      expect(res.sentBody).to.exist
      expect(res.sentBody).to.have.property('meta')
      expect(res.sentBody.meta).to.have.property('success', true)
      expect(res.sentBody).to.have.property('data', 'some_data')
    })
  })
  
  describe('#catch', function() {
    
    let api
    beforeEach(async function() {
      api = new Api(req, res, defaultOpts)
    })
    
    it('should send errors', async function() {
      await api.catch(() => {
        throw new Error('test')
      })
      
      expect(res.sentStatus).to.equal(400)
      expect(res.sentBody.meta).to.have.property('messages').that.includes('test')
    })
    it('should call the errorHook', async function() {
      let error = new Error('test')
      let args = null
      let hook = (...passed) => { args = passed }
      
      await api.catch(() => { throw error }, hook)
      
      expect(args[0]).to.equal(error)
      expect(args[1]).to.equal(api)
    })
  })
})

describe('MetaBlock', function() {
  
  describe('#constructor', function() {
    let api
    beforeEach(async function() {
      api = new Api(null, null, defaultOpts)
    })
    
    it('should format the meta block', async function() {
      let meta = new MetaBlock(true, [ 'msg' ], 200, api)
      
      expect(meta).to.have.property('success', true)
      expect(meta).to.have.property('messages').that.includes('msg')
      expect(meta).to.have.property('name', 'Name')
      expect(meta).to.have.property('version', '0.1.0')
    })
    it('should convert messages to an array', async function() {
      let meta = new MetaBlock(true, 'msg', 200, api)
      expect(meta).to.have.property('messages').that.includes('msg')
    })
  })
})
