const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send({ 
    name: 'xzhang',
    email: 'xzhang@gmail.com',
    mobile: '167892763446'
  })
})

module.exports = router