const cookieSession = require('./cookieSession')
const basicCookie = require('./basicCookie')
const expressSession = require('./expressSession')
const cancel = require('./cancel')

module.exports = {
  cookieSessionRouter: cookieSession,
  basicCookieRouter: basicCookie,
  expressSessionRouter: expressSession,
  cancelRouter: cancel
}