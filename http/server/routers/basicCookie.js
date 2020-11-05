const express = require('express')
const router = express.Router()

const handler = (req, res) => {
  if (!req.cookies['cookie-name']) {
    
  }

  res.cookie('cookie-name', 'cookie-value', { domain: 'localhome' })
  res.cookie('cookie-name1', 'cookie-value1', { maxAge: 10 * 60 * 1000, path: '/', signed: true })
  res.cookie('cookie-name2', 'cookie-value2', { httpOnly: false, secure: false, sameSite: true })
  res.cookie('cookie-name3', 'cookie-value3', { domain: '.localhome' })
  res.cookie('cookie-name4', 'cookie-value4')
  
  res.send({ 
    name: 'xzhang',
    email: 'xzhang@gmail.com',
    mobile: '167892763446'
  })
}

router.get('/', handler)
router.post('/', handler)

module.exports = router                                                                                                                                                                