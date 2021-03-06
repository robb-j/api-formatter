import { Api, MetaBlock } from '../index'

class MockRequest {
  api!: Api
}

class MockResponse {
  api!: Api
  status = jest.fn(() => this)
  send = jest.fn(() => this)
}

const defaultApiOptions = {
  name: 'Geoff',
  version: 'v1'
}

describe('Api', () => {
  let req: MockRequest
  let res: MockResponse
  let api: Api

  beforeEach(() => {
    req = new MockRequest()
    res = new MockResponse()
    api = new Api(req, res, defaultApiOptions)
  })

  describe('.middleware', () => {
    let middleware: any

    beforeEach(() => {
      middleware = Api.middleware(defaultApiOptions)
    })

    it('should add an api to the request', () => {
      middleware(req, res, () => {})
      expect(req.api).toBeInstanceOf(Api)
    })

    it('should add an api to the response', () => {
      middleware(req, res, () => {})
      expect(res.api).toBeInstanceOf(Api)
    })

    it('should set the api name', () => {
      middleware(req, res, () => {})
      expect(req.api.name).toEqual('Geoff')
    })

    it('should set the api version', () => {
      middleware(req, res, () => {})
      expect(req.api.version).toEqual('v1')
    })

    it('should call next', () => {
      let spy = jest.fn()
      middleware(req, res, spy)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('#constructor', () => {
    it('should make an instance', () => {
      let api = new Api(req, res, defaultApiOptions)

      expect((api as any).req).toBe(req)
      expect((api as any).res).toBe(res)
      expect(api.name).toBe('Geoff')
      expect(api.version).toBe('v1')
    })
  })

  describe('#sendFail', () => {
    it('should set the status code', () => {
      api.sendFail('custom_message')
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should format a fail', () => {
      api.sendFail('custom_message')
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            name: 'Geoff',
            version: 'v1',
            success: false,
            status: 400,
            messages: ['custom_message']
          }),
          data: null
        })
      )
    })

    it('should http/200 if httpFail is false', async () => {
      api.httpFail = false
      api.sendFail('custom_message')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({ status: 200 })
        })
      )
    })
  })

  describe('#sendData', () => {
    it('should set the status code', () => {
      api.sendData({ message: 'Hey!' })
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should format a data payload', () => {
      api.sendData({ message: 'Hey!' })
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ message: 'Hey!' })
        })
      )
    })
  })

  describe('#catch', () => {
    it('should send errors', async () => {
      await api.catch(() => {
        throw new Error('some_error')
      })

      expect(res.status).toHaveBeenCalledWith(400)
      let [{ meta }] = res.send.mock.calls[0] as any
      expect(meta.messages).toContain('some_error')
    })

    it('should call the error hook', async () => {
      let error = new Error('test')
      let hook = jest.fn()

      await api.catch(() => {
        throw error
      }, hook)

      expect(hook).toHaveBeenCalledWith(error, api)
    })
  })
})

describe('MetaBlock', function() {
  describe('#constructor', function() {
    let api: Api
    beforeEach(async function() {
      api = new Api(null, null, defaultApiOptions)
    })

    it('should format the meta block', async function() {
      let meta = new MetaBlock(true, ['custom_message'], 200, api)

      expect(meta.success).toBe(true)
      expect(meta.messages).toContain('custom_message')
      expect(meta.name).toBe('Geoff')
      expect(meta.version).toBe('v1')
      expect(meta.status).toBe(200)
    })
    it('should convert messages to an array', async function() {
      let meta = new MetaBlock(true, 'custom_message', 200, api)
      expect(meta.messages).toContain('custom_message')
    })
  })
})
