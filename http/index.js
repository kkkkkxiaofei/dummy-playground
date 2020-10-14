function http(method, url, requestData) {
  let request = new XMLHttpRequest()

  request.open(method, url)

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      console.log('=====request completed=====');
      console.log('response:', request);
    }
    
  }

  request.onabort = function() {

  }

  request.onerror = function() {

  }

  request.ontimeout = function() {

  }

  request.send(requestData);
}


http('GET', "https://restapi.amap.com/v3/weather/weatherInfo?parameters")