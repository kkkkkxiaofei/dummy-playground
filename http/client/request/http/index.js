const xhr = require('./xhr')

function Http(adaptor) {
  this.adaptor = adaptor
}

['GET', 'POST'].forEach(method => {
  Http.prototype[method.toLowerCase()] = function(url, data) {
    return this.adaptor({ method, url, data })
  }
})

const instance = new Http(xhr)


module.exports = instance