const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const { profile } = require('./routers')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,set-cookie');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next()
})
app.use(cookieParser())

app.use('/profile', profile)

app.listen(8081, () => {
  console.log(`server is listening ${8081} port...`)
})