const parseHeader = require('./parseHeader')

function xhr(config) {
  const { method, url, data, withCredentials, cancelToken } = config
  return new Promise(function(resolve, reject) {
    
    let request = new XMLHttpRequest()

    request.withCredentials = !!withCredentials

    request.open(method.toUpperCase(), url)
  
    request.onreadystatechange = function() {
      if (!request || request.status === 0 || request.readyState !== 4) 
        return 

      const response = {
        data: JSON.parse(request.response),
        status: request.status,
        statusText: request.statusText,
        headers: parseHeader(request.getAllResponseHeaders()),
        request: request
      }
      console.log('request complete', response)
      resolve(response)        
      request = null
    }
  
    request.onabort = function(e) {
      console.log('request abort')
      reject(e)
      request = null
    }
  
    request.onerror = function(e) {
      console.log('request error')
      reject(e)
      request = null
    }
  
    request.ontimeout = function() {
      console.log('request timeout')
      reject(e)
      request = null
    }
    
    if (cancelToken) {
      cancelToken.promise.then(function (reason) {
        if (request === null)
          return

        reject(reason)
        request.abort()

        request = null
      })
    }

    request.send(data);

  })
}

module.exports = xhr