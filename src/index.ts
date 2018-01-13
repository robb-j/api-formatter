export type Messages = String[] | String
export type CatchBlock = (api: Api) => void
export type ErrorHook = (error: Error, api?: Api) => void

export class MetaBlock {
  
  public success: Boolean
  public messages: String[]
  public status: Number
  public name?: String
  public version?: String
  
  constructor(success: Boolean, messages: String[], status: Number, api: Api) {
    this.success = success
    this.messages = messages
    this.status = status
    this.name = api.name
    this.version = api.version
  }
}

/** A class for creating a json envelope for sending api responses */
export class Api {
  
  /** Creates an express middleware that adds req.api & res.api instances */
  static middleware(name: String = null, version: String = null) {
    return (req: any, res: any, next: () => void) => {
      let api = new this(req, res, name, version)
      req.api = api
      res.api = api
      next()
    }
  }
  
  private req: any
  private res: any
  public name?: String
  public version?: String
  
  /** Creates a new Api instance from an Express responses */
  constructor(req: any, res: any, name?: String, version?: String) {
    this.req = req
    this.res = res
    this.name = name
    this.version = version
  }
  
  /** Creates a new meta block */
  private makeMetaBlock(isSuccessful: Boolean, messages: Messages, status: Number) {
    return new MetaBlock(
      isSuccessful,
      (messages instanceof String) ? [messages] : messages,
      status,
      this
    )
  }
  
  /** Sends an api failure */
  public sendFail(messages: Messages, status: Number = 400) {
    this.res.status(status).send({
      meta: this.makeMetaBlock(false, messages, status),
      data: null
    })
  }
  
  /** Sends a data response */
  public sendData(data: any, status: Number) {
    this.res.status(status).send({
      meta: this.makeMetaBlock(true, [], status),
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
