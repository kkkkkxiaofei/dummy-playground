const express = require('express')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const expressSession = require('express-session')
const { 
  basicCookieRouter, 
  cookieSessionRouter,
  expressSessionRouter,
  cancelRouter 
} = require('./routers')

const app = express()

//can be replaced by cors npm
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,set-cookie');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next()
})

app.use(cookieParser('my secret'))
// app.use(cookieSession({
//   name: 'session-name',
//   secret: 'session-secret',
//   maxAge: 2 * 60 * 1000,
//   signed: true
// }))
app.use(expressSession({
  resave: false,
  cookie: {
    maxAge: 10 * 60 * 1000
  }
}))
app.use('/cookie-session', cookieSessionRouter)
app.use('/basic-cookie', basicCookieRouter)
app.use('/express-session', expressSessionRouter)
app.use('/cancel', cancelRouter)

app.listen(8081, 'localhome', () => {
  console.log(`server is listening ${8081} port...`)
})