const mail = require(__basedir + '/inc/mail')
const db = require(__basedir + '/inc/db')
const logger = require(__basedir + '/inc/logger')

module.exports = (req, res) => {
    const code = req.params.code
    const token = req.params.token

    if (token === 'resend') {
        if (req.isAuthenticated()) {
            if (!+req.user.active) {
                mail.activation(
                    req.user.mail,
                    req.user.name,
                    req.user.code,
                    (status, message) => {
                        if (!status) {
                            req.flash(
                                'activationMailMessage',
                                '{"state": "danger", "message": "Wystąpił nieoczekiwany błąd przy wysyłaniu maial. Skontaktuj się z administratorem."}'
                            )
                            return res.redirect('/user/overview')
                        } else {
                            req.flash(
                                'activationMailMessage',
                                '{"state": "success", "message": "Pomyślnie wysłano mail aktywacyjny. Sprawdź swoją pocztę i aktywuj konto."}'
                            )
                            return res.redirect('/user/overview')
                        }
                    }
                )
                    .then()
                    .catch(e => {
                        logger.error(
                            `Mail send error: ${e} - ${req.user.name} - ${req.ip}`
                        )
                        req.flash(
                            'activationMailMessage',
                            '{"state": "danger", "message": "Wystąpił nieoczekiwany błąd przy wysyłaniu maial. Skontaktuj się z administratorem."}'
                        )
                        res.redirect('/user/overview')
                    })
            } else {
                req.flash(
                    'activationMailMessage',
                    '{"state": "danger", "message": "Twoje konto jest już aktywne."}'
                )
                res.redirect('/user/overview')
            }
        } else res.redirect('/user/overview')
    } else {
        db.query('SELECT * FROM users WHERE name = ?', token, (err, result) => {
            if (err) res.send(err)
            if (!result.length > 0) {
                req.flash(
                    'loginMessage',
                    '{"state": "danger", "message": "Podany użytkownik nie istnieje"}'
                )
                return res.redirect('/user/login')
            }
            if (result[0]['code'] === code) {
                db.query(
                    'UPDATE users SET active = 1 WHERE name = ?',
                    token,
                    (err, response) => {
                        if (err) return res.send(err)
                        if (response['changedRows'] > 0) {
                            if (req.isAuthenticated()) {
                                req.flash(
                                    'activationMailMessage',
                                    '{"state": "success", "message": "Pomyślnie aktywowano konto."}'
                                )
                                return res.redirect('/user/overview')
                            } else {
                                req.flash(
                                    'loginMessage',
                                    '{"state": "success", "message": "Pomyślnie aktywowano konto. Możesz się teraz zalogować."}'
                                )
                                return res.redirect('/user/login')
                            }
                        } else {
                            if (req.isAuthenticated()) {
                                req.flash(
                                    'activationMailMessage',
                                    '{"state": "success", "message": "Twoje konto jest już aktywowane."}'
                                )
                                return res.redirect('/user/overview')
                            } else {
                                req.flash(
                                    'loginMessage',
                                    '{"state": "success", "message": "To konto jest już aktywowane"}'
                                )
                                return res.redirect('/user/login')
                            }
                            return res.redirect('/user/overview')
                        }
                    }
                )
            }
        })
    }
}
