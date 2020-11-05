import http from './http'
import axios from './axios'

axios.defaults.withCredentials = true
http.defaults.withCredentials = true

export {
  http,
  axios
}