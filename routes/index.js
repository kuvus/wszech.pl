const express = require('express')
const router = express.Router()
const path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', {title: 'Strona Główna'})
    // res.sendFile(path.join(__dirname, '..', 'views', 'main.html'))
})
router.get('/faq', function(req, res, next) {
    res.render('info/faq', {title: 'FAQ'})
    // res.sendFile(path.join(__dirname, '..', 'views', 'main.html'))
})

module.exports = router
