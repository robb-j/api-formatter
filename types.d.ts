import { Api } from './dist/index'
export * from './dist/index'

declare global {
  namespace Express {
    interface Request {
      api: Api;
    }
    interface Response {
      api: Api;
    }
  }
}
