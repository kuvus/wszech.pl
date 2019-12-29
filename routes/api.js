const express = require('express')
const router = express.Router()

const routes = require('./api/')

router.get('*', function(req, res, next) {
    if (req.accepts('json')) res.send({error: true, response: 'API is only available over POST'})
    else res.type('txt').send('API is only available over POST')
})
router.post('/check', routes.check)
router.post('/mail', routes.mail)

module.exports = router
