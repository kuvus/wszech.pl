const db = require(__basedir + '/inc/db')
const argon = require('argon2')
const md5 = require('md5')
const sendMail = require(__basedir + '/inc/mail')
const logger = require(__basedir + '/inc/logger')
const {salt} = require(__basedir + '/config.json')

const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegex = /^[a-zA-Z0-9]+$/u

const checkExistence = (name, mail, callback) => {
    if (name && mail && callback) {
        db.query('SELECT * FROM users WHERE name = ?', name, (err, result) => {
            if (result.length > 0) return callback({exists: true, type: 'name'})
            db.query(
                'SELECT * FROM users WHERE mail = ?',
                mail,
                (err2, result2) => {
                    if (result2.length > 0)
                        return callback({exists: true, type: 'mail'})
                    else return callback({exists: false})
                }
            )
        })
    } else {
        return false
    }
}

exports.create = async (name, password, mail, callback) => {
    if (name.length > 0 && password.length > 0 && mail.length > 0) {
        if (mailRegex.test(mail)) {
            if (nameRegex.test(name)) {
                checkExistence(name, mail, async response => {
                    if (response.exists) {
                        if (response.type === 'name') {
                            return callback({
                                success: false,
                                message:
                                    'Konto o podanej nazwie użytkownika już istnieje.',
                            })
                        } else if (response.type === 'mail') {
                            return callback({
                                success: false,
                                message:
                                    'Konto o podanym adresie e-mail już istnieje.',
                            })
                        } else {
                            return callback({
                                success: false,
                                message: 'Wystąpił nieoczekiwany błąd.',
                            })
                        }
                    }

                    const confirmationCode = md5(salt + name + Date.now())

                    try {
                        const pass = await argon
                            .hash(password, {
                                type: argon.argon2id,
                            })
                            .catch(e => {
                                logger.error(`Argon2 error: ${e}`)
                            })
                        await db.query(
                            'INSERT INTO users (name, password, mail, code) VALUES (?, ?, ?, ?)',
                            [name, pass, mail, confirmationCode]
                        )

                        await sendMail
                            .activation(
                                mail,
                                name,
                                confirmationCode,
                                status => {
                                    if (!status) {
                                        callback({
                                            success: false,
                                            message:
                                                'Wystąpił błąd przy wysyłaniu maila. Skonaktuj się z administratorem.',
                                        })
                                    }
                                }
                            )
                            .catch(e => {
                                logger.error(
                                    `Mail send error: ${e} - ${name}:${mail}`
                                )
                                callback({
                                    success: false,
                                    message:
                                        'Wystąpił błąd przy wysyłaniu maila. Skonaktuj się z administratorem.',
                                })
                            })
                        return callback({success: true})
                    } catch (e) {
                        logger.error(`Auth error: ${e}`)
                        return callback({
                            success: false,
                            message: 'Wystąpił nieoczekiwany błąd.',
                        })
                    }
                })
            } else
                return callback({
                    success: false,
                    message:
                        'Podana nazwa używkownika zawiera niedozwolone znaki. Dozwolone znaki to: [a-zA-Z0-9]',
                })
        } else
            return callback({
                success: false,
                message:
                    'Nieprawidłowy format adresu email. Prawidłowy format to: nazwa@domena.pl',
            })
    } else
        return callback({
            success: false,
            message: 'Nie wypełniłeś wszystkich pól!',
        })
}

exports.changePassword = async (
    username,
    oldPassword,
    newPassword,
    callback
) => {
    if (
        !(
            username.length > 0 &&
            oldPassword.length > 0 &&
            newPassword.length > 0
        )
    ) {
        return callback({
            success: false,
            message: 'Niepoprawne zapytanie.',
        })
    }

    //    TODO: skończ to tutaj - zmiana hasła
}
