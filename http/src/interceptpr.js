function Interceptor() {
  this.handlers = []
}

Interceptor.prototype.use = function(resolve, reject) {
  this.handlers.push([resolve, reject])
}

module.exports = Interceptor