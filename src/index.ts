export type Messages = String[] | String
export type CatchBlock = (api: Api) => void
export type ErrorHook = (error: Error, api?: Api) => void

export class MetaBlock {
  
  public success: Boolean
  public messages: String[]
  public status: Number
  public name?: String
  public version?: String
  
  constructor(success: Boolean, messages: Messages, status: Number, api: Api) {
    this.success = success
    this.messages = (messages instanceof String) ? [messages] : messages
    this.status = status
    this.name = api.name
    this.version = api.version
  }
}

export interface IApiOptions {
  name?: String
  version?: String
  httpFail?: Boolean
}

/** A class for creating a json envelope for sending api responses */
export class Api {
  
  /** Creates an express middleware that adds req.api & res.api instances */
  // static middleware(name: String = null, version: String = null) {
  static middleware(options: IApiOptions) {
    return (req: any, res: any, next: () => void) => {
      let api = new this(req, res, options)
      req.api = api
      res.api = api
      next()
    }
  }
  
  private req: any
  private res: any
  public name?: String
  public version?: String
  public httpFail: Boolean
  
  /** Creates a new Api instance from an Express responses */
  constructor(req: any, res: any, options: IApiOptions = {}) {
    this.req = req
    this.res = res
    this.name = options.name || process.env.npm_package_name || null
    this.version = options.version || process.env.npm_package_version || null
    this.httpFail = options.httpFail === undefined ? true : options.httpFail
  }
  
  /** Sends an api failure */
  public sendFail(messages: Messages, status?: Number) {
    if (status === undefined) {
      status = this.httpFail ? 400 : 200
    }
    this.res.status(status).send({
      meta: new MetaBlock(false, messages, status, this),
      data: null
    })
  }
  
  /** Sends a data response */
  public sendData(data: any, status: Number = 200) {
    this.res.status(status).send({
      meta: new MetaBlock(true, [], status, this),
      data: data
    })
  }
  
  /** Catches errors and sends the message as a sendFail */
  async catch(block: CatchBlock, hook?: ErrorHook) {
    try {
      await block(this)
    }
    catch (error) {
      if (hook) hook(error, this)
      this.sendFail(error.message)
    }
  }
}
