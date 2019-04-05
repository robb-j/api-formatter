export type Messages = string[] | string
export type CatchBlock = (api: Api) => void
export type ErrorHook = (error: Error, api?: Api) => void

export class MetaBlock {
  public success: boolean
  public messages: string[]
  public status: number
  public name?: string
  public version?: string

  constructor(success: boolean, messages: Messages, status: number, api: Api) {
    this.success = success
    this.messages = typeof messages === 'string' ? [messages] : messages
    this.status = status
    this.name = api.name
    this.version = api.version
  }
}

export interface IApiOptions {
  name?: string
  version?: string
  httpFail?: boolean
}

/** A class for creating a json envelope for sending api responses */
export class Api {
  /** Creates an express middleware that adds req.api & res.api instances */
  // static middleware(name: string = null, version: string = null) {
  static middleware(options: IApiOptions) {
    return (req: any, res: any, next: () => void) => {
      let api = new this(req, res, options)
      req.api = api
      res.api = api
      next()
    }
  }

  protected req: any
  protected res: any

  public name?: string
  public version?: string
  public httpFail: boolean

  /** Creates a new Api instance from an Express responses */
  constructor(req: any, res: any, options: IApiOptions = {}) {
    this.req = req
    this.res = res
    this.name = options.name || process.env.npm_package_name || undefined
    this.version =
      options.version || process.env.npm_package_version || undefined
    this.httpFail = options.httpFail === undefined ? true : options.httpFail
  }

  /** Sends an api failure */
  public sendFail(messages: Messages, status?: number) {
    status = this.pickStatusCode(status)
    this.res
      .status(status)
      .send(this.makeEnvelope(false, messages, status, null))
  }

  /** Sends a data response */
  public sendData(data: any, status: number = 200) {
    this.res.status(status).send(this.makeEnvelope(true, [], status, data))
  }

  /** Catches errors and sends the message as a sendFail */
  async catch(block: CatchBlock, hook?: ErrorHook) {
    try {
      await block(this)
    } catch (error) {
      if (hook) hook(error, this)
      this.sendFail(error.message)
    }
  }

  protected pickStatusCode(status?: number): number {
    return status === undefined ? (this.httpFail ? 400 : 200) : status
  }

  protected makeEnvelope(
    success: boolean,
    messages: Messages,
    status: number,
    data: any
  ): any {
    return {
      meta: new MetaBlock(success, messages, status, this),
      data
    }
  }
}
