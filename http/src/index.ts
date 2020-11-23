import { Config } from './types'
import defaultConfig from './config'
import Interceptor from './interceptor'
import CancelToken from './CancelToken'

function Http(instanceConfig) {
  this.defaults = instanceConfig
  this.interceptors = {
    request: new Interceptor(),
    response: new Interceptor()
  }
}

function mergeConfig(defaultOne, newOne) {
  return Object.assign(defaultOne, newOne)
}

Http.prototype.request = function(config: Config) {
  const mergedConfig = mergeConfig(this.defaults, config)
  const { request, response } = this.interceptors
  return [...request.handlers, [this.defaults.adaptor], ...response.handlers]
          .reduce(
            function(result, current) {
              console.log(current, 'current')
              result = result.then(current[0], current[1])
              return result
            }, 
            Promise.resolve(mergedConfig)
          )
}

const methodsWithData = ['post', 'put']
const methodsWithoutData = ['get', 'post']


methodsWithData.forEach(function(method) {
  Http.prototype[method] = function(url, data, config) {
      return this.request(
        Object.assign(config || {}, {
          method,
          url,
          data
        })
      )
    }
  }
)

methodsWithoutData.forEach(function(method) {
  Http.prototype[method] = function(url, config) {
      return this.request(
        Object.assign(config || {}, {
          method,
          url,
        })
      )
    }
  }
)

const instance = new Http(defaultConfig)

instance.CancelToken = CancelToken

export default instance