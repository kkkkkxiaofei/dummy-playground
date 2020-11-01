const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  if (!req.cookies['cookie-name']) {
    res.cookie('cookie-name', 'cookie-value')
    res.cookie('cookie-name1', 'cookie-value1', { maxAge: 2 * 60 * 1000, path: '/', signed: true })
    res.cookie('cookie-name2', 'cookie-value2', { httpOnly: false, secure: false, sameSite: true })
  }
  
  res.send({ 
    name: 'xzhang',
    email: 'xzhang@gmail.com',
    mobile: '167892763446'
  })
})

module.exports = router                                                                                                                                                                