const express = require('express')
const app = express()
const { profile } = require('./routers')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/profile', profile)

app.listen(8081, () => {
  console.log(`server is listening ${8081} port...`)
})