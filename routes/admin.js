const express = require('express')
const router = express.Router()

// TODO: skończ to wreszcie xD

router.get('/', function(req, res) {
    res.redirect('https://wszech.pl')
})

router.get('/login', function(req, res, next) {
    res.render('user/auth', {
        title: 'Logowanie',
        type: 'signin',
        main: false,
    })
})

router.get('/logout', function(req, res, next) {
    res.redirect('https://wszech.pl')
})

router.get('/test', function(req, res) {
    res.render('panel/main', {
        title: 'Panel administratora',
        page: 'Podsumowanie',
        nick: 'kuvuś', // TODO: nick usera
        nav: [
            {
                name: 'Strona główna',
                href: 'https://wszech.pl/',
            },
        ],
        side: [
            {
                active: true,
                name: 'Podsumowanie',
                href: 'test',
                icon: 'fas fa-th',
            },
            {
                active: false,
                name: 'Lista domen',
                href: 'domains',
                icon: 'far fa-list-ul',
            },
            {
                active: false,
                name: 'Ustawienia',
                href: 'settings',
                icon: 'fal fa-cog',
            },
        ],
    })
})

module.exports = router
