function CancelToken(executor) {
  if (typeof executor !== 'function')
    throw new Error('executor must be function!')

  let _resolve;
  this.promise = new Promise(function(resolve) {
    _resolve = resolve
  })
  
  executor(function cancel(reason) {
    _resolve(reason)
  })
}

CancelToken.source = function() {
  let cancel;
  const token = new CancelToken(function(c) {
    cancel = c
  })
  return {
    token,
    cancel
  }
}

module.exports = CancelToken