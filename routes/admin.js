const express = require('express')
const router = express.Router()
const isAdmin = require(__basedir + '/middlewares/adminRestriction')

const routes = require('./panel/admin')

router.get('/', function (req, res) {
    return res.redirect('/admin/overview')
})

router.use(isAdmin)
router.get('/overview', routes.overview)

module.exports = router
