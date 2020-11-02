const cookieSession = require('./cookieSession')
const basicCookie = require('./basicCookie')
const expressSession = require('./expressSession')

module.exports = {
  cookieSessionRouter: cookieSession,
  basicCookieRouter: basicCookie,
  expressSessionRouter: expressSession
}