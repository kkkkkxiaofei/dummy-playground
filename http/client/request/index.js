import http from './http'
import axios from './axios'

http.interceptors.request.use(
  function(config) {
    config.withCredentials = true
    return config 
  }, 
  function(error) {
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  function(response) {
    response.data.date = new Date().toString()
    return response
  }, 
  function(error) {
    return Promise.reject(error)
  }
)

export {
  http,
  axios
}