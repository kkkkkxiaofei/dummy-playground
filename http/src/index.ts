import { Config, HandlerInput } from './types'
import defaultConfig from './config'
import Interceptor from './Interceptor'
import CancelToken from './CancelToken'

class Http {
  private defaults: Config
  
  private interceptors: {
    request: Interceptor,
    response: Interceptor
  }
  public CancelToken: typeof CancelToken

  constructor(instanceConfig: Config) {
    this.defaults = instanceConfig
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    }  
  }

  request(config: Config) {
    const mergedConfig = { ...this.defaults, ...config }
    const { request, response } = this.interceptors
    return [...request.handlers, [this.defaults.adaptor], ...response.handlers]
            .reduce(
              function(result: Promise<HandlerInput>, current) {
                console.log(current, 'current')
                result = result.then(current[0], current[1])
                return result
              }, 
              Promise.resolve(mergedConfig)
            )  
  }

  requestWithData(method: string, url: string, data: any, config: Config) {
    return this.request(
      {
        ...(config || {}),
        method,
        url,
        data
      }
    )
  }

  requestWithoutData(method: string, url: string, config: Config) {
    return this.request(
      {
        ...(config || {}),
        method,
        url
      }
    )
  }
  
  post(url: string, data: any, config: Config) {
    return this.requestWithData('post', url, data, config)
  }

  put(url: string, data: any, config: Config) {
    return this.requestWithData('put', url, data, config)
  }

  get(url: string, config: Config) {
    return this.requestWithoutData('get', url, config)
  }

  delete(url: string, config: Config) {
    return this.requestWithoutData('delete', url, config)
  }
}

const instance = new Http(defaultConfig as Config)

instance.CancelToken = CancelToken

export default instance