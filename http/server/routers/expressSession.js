const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1
  
  res.send({ 
    name: 'xzhang',
    email: 'xzhang@gmail.com',
    mobile: '167892763446',
    views: req.session.views
  })
})

module.exports = router                                                                                                                                                                