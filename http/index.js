function http(method, url, requestData) {
  return new Promise(function(resolve, reject) {
    
    let request = new XMLHttpRequest()

    request.open(method, url)
  
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        const response = {
          responseData: request.responseText,
          status: request.status,
          headers: request.getAllResponseHeaders(),
          request: request
        }
        console.log('request complete')
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
  
    request.send(requestData);

  })
}


http('GET', "https://restapi.amap.com/v3/weather/weatherInfo?parameters")
  .then(console.log)