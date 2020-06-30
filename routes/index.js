const express = require('express')
const router = express.Router()
const path = require('path')

/* GET home page. */
router.get('/', function(req, res) {
    res.render('main', {title: 'Strona Główna'})
})
router.get('/faq', function(req, res) {
    res.render('info/faq', {title: 'FAQ'})
})

module.exports = router
