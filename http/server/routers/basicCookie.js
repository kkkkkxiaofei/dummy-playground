const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  if (!req.cookies['cookie-name']) {
    res.cookie('cookie-name', 'cookie-value')
    res.cookie('cookie-name1', 'cookie-value1', { maxAge: 10 * 60 * 1000, path: '/', signed: true })
    res.cookie('cookie-name2', 'cookie-value2', { httpOnly: false, secure: false, sameSite: true })
    res.cookie('cookie-name3', 'cookie-value3')
    res.cookie('cookie-name4', 'cookie-value4', { secure: true })
  }
  
  res.send({ 
    name: 'xzhang',
    email: 'xzhang@gmail.com',
    mobile: '167892763446'
  })
})

module.exports = router                                                                                                                                                                