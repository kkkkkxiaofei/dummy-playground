const defaultConfig = require('./config')
const Interceptor = require('./interceptpr')
const CancelToken = require('./CancelToken')

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

Http.prototype.request = function(config) {
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

const methods = ['get', 'post']

methods.forEach(function(method) {
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

const instance = new Http(defaultConfig)

instance.CancelToken = CancelToken

module.exports = instance