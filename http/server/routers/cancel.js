const express = require('express')
const router = express.Router()

const handler = (req, res) => {
  console.log('======start async fetch======')
  setTimeout(function() {
    res.send({ 
      name: 'xzhang',
      email: 'xzhang@gmail.com',
      mobile: '167892763446'
    })
    console.log('======end async fetch======')
  }, 4000)
  
  
}

router.get('/', handler)
router.post('/', handler)

module.exports = router                                                                                                                                                                