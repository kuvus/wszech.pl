const express = require('express')
const router = express.Router()
const passport = require('passport')

const routes = require('./panel/user')

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/user/login?redirectTo=' + req.url)
    }
}

function isActive(req, res, next) {
    if (!+req.user.active) return routes.notActive(req, res)
    else return next()
}

function isBlocked(req, res, next) {
    if (+req.user.blocked) return routes.blocked(req, res)
    else return next()
}

function loginLogged(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/user/overview')
    else return next()
}

router.get('/', function(req, res) {
    return res.redirect('/user/overview')
})

router.get('/register', loginLogged, routes.register.get)
router.get('/login', loginLogged, routes.login)
router.get('/logout', isLoggedIn, routes.logout)
router.get('/overview', isLoggedIn, isActive, isBlocked, routes.overview)
router.get('/domains', isLoggedIn, isActive, isBlocked, routes.domains)
router.get('/settings', isLoggedIn, isActive, isBlocked, routes.settings)
router.get('/confirm/:token/:code*?', routes.confirm)
router.get(
    '/domains/create',
    isLoggedIn,
    isActive,
    isBlocked,
    routes.createDomain
)

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/user/login',
    }),
    function(req, res) {
        if (req.cookies.redirectTo)
            if (req.cookies.redirectTo.length > 0) {
                let redirectTo = req.cookies.redirectTo
                res.cookie('redirectTo', '', {
                    maxAge: 1,
                })
                res.redirect('/user' + redirectTo)
            } else {
                res.cookie('redirectTo', '', {
                    maxAge: 1,
                })
                res.redirect('/user/overview')
            }
        else res.redirect('/user/overview')
    }
)
router.post('/register', routes.register.post)

module.exports = router
