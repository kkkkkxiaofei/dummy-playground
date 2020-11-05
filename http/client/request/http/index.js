const defaultConfig = require('./config')

function Http(instanceConfig) {
  this.defaults = instanceConfig
}

function mergeConfig(defaultOne, newOne) {
  return Object.assign(defaultOne, newOne)
}

Http.prototype.request = function(config) {
  const mergedConfig = mergeConfig(this.defaults, config)
  return this.defaults.adaptor(mergedConfig)
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


module.exports = instance