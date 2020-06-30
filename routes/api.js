const express = require('express')
const router = express.Router()

const routes = require('./api/')

router.get('*', function(req, res) {
    if (req.accepts('json'))
        res.send({error: true, response: 'API is only available over POST'})
    else res.type('txt').send('API is only available over POST')
})
router.post('/check', routes.check)
router.post('/register', routes.register)
router.post('/registerCheck', routes.registerCheck)
router.post('/deleteDomain', routes.deleteDomain)
router.post('/renew', routes.renew)
router.post('/readNotifications', routes.notifications)
router.post('/updateDomain', routes.updateDomain)

module.exports = router
