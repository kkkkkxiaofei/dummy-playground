const parseHeader = require('./parseHeader')

function xhr(config) {
  const { method, url, data } = config
  return new Promise(function(resolve, reject) {
    
    let request = new XMLHttpRequest()

    request.open(method, url)
  
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        const response = {
          data: JSON.parse(request.response),
          status: request.status,
          statusText: request.statusText,
          headers: parseHeader(request.getAllResponseHeaders()),
          request: request
        }
        console.log('request complete', response)
        resolve(response)        
      }
    }
  
    request.onabort = function(e) {
      console.log('request abort')
      reject(e)
    }
  
    request.onerror = function(e) {
      console.log('request error')
      reject(e)
    }
  
    request.ontimeout = function() {
      console.log('request timeout')
      reject(e)
    }
  
    request.send(data);

  })
}

module.exports = xhr