const db = require('./db')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const argon = require('argon2')

const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegex = /^[a-zA-Z0-9]+$/u

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    db.query('SELECT * FROM users WHERE id = ?', id, (err, rows) => {
        done(err, rows[0])
    })
})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'name',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            if (mailRegex.test(email)) {
                try {
                    db.query(
                        'SELECT * FROM users WHERE mail = ?',
                        email,
                        (err, result) => {
                            if (err) return done(err)
                            if (!result.length) {
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        '{"state": "danger", "message": "Nie znaleziono takiego użytkownika."}'
                                    )
                                )
                            }
                            try {
                                argon
                                    .verify(result[0].password, password)
                                    .then(isGood => {
                                        if (!isGood)
                                            return done(
                                                null,
                                                false,
                                                req.flash(
                                                    'loginMessage',
                                                    '{"state": "danger", "message": "Podałeś błędne hasło."}'
                                                )
                                            ) // create the loginMessage and save it to session as flashdata

                                        return done(null, result[0])
                                    })
                            } catch (e) {
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        '{"state": "danger", "message": "Wystąpił nieoczekiwany błąd."}'
                                    )
                                )
                            }
                        }
                    )
                } catch (e) {
                    return done(e)
                }
            } else if (nameRegex.test(email)) {
                try {
                    db.query(
                        'SELECT * FROM users WHERE name = ?',
                        email,
                        (err, result) => {
                            if (err) return done(err)
                            if (!result.length) {
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        '{"state": "danger", "message": "Nie znaleziono takiego użytkownika."}'
                                    )
                                )
                            }
                            if (!result[0].password.startsWith('$argon2'))
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        '{"state": "danger", "message": "Wystąpił nieoczekiwany błąd."}'
                                    )
                                )
                            try {
                                argon
                                    .verify(result[0].password, password)
                                    .then(isGood => {
                                        if (!isGood)
                                            return done(
                                                null,
                                                false,
                                                req.flash(
                                                    'loginMessage',
                                                    '{"state": "danger", "message": "Podałeś błędne hasło."}'
                                                )
                                            )
                                        return done(null, result[0])
                                    })
                                    .catch(e => {
                                        console.log(e)
                                    })
                            } catch (e) {
                                console.log(e)
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        '{"state": "danger", "message": "Wystąpił nieoczekiwany błąd."}'
                                    )
                                )
                            }
                        }
                    )
                } catch (e) {
                    return done(e)
                }
            }
        }
    )
)
