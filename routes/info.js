const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource')
})

router.get('/polityka-cookies', function(req, res, next) {
    res.render('info/polityka-cookies', {title: 'FAQ'})
})

router.get('/polityka-prywatnosci', function(req, res, next) {
    res.render('info/polityka-prywatnosci', {title: 'FAQ'})
})

router.get('/regulamin', function(req, res, next) {
    res.render('info/regulamin', {title: 'FAQ'})
})

router.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

module.exports = router
