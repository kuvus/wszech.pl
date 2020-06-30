const cache = require(__basedir + '/inc/cache.js')
const logger = require(__basedir + '/inc/logger')
const db = require(__basedir + '/inc/db')
const {captcha} = require(__basedir + '/config')
const cf = require(__basedir + '/inc/cf')

module.exports = (req, res) => {
    if (!req.isAuthenticated())
        return res.send({error: true, response: 'Nie jesteś zalogowany'})
    db.getLimits(req, limits => {
        if (limits.error)
            return res.send({
                error: true,
                response:
                    'Wystąpił błąd przy sprawdzaniu. Skontaktuj się z administratorem.',
            })
        if (limits.domainsCount >= limits.domainsLimit)
            return res.send({
                error: true,
                response: 'Osiągnąłeś już maksymalną liczbę subdomen.',
            })
        if (!req.body.domain)
            return res.send({
                error: true,
                response: 'Nie podałeś nazwy subdomeny',
            })
        if (!req.body.type)
            return res.send({error: true, response: 'Typ wpisu DNS jest pusty'})
        if (!req.body.record)
            return res.send({
                error: true,
                response: 'Wartość wpisu DNS jest pusta',
            })
        if (!req.body.terms)
            return res.send({
                error: true,
                response: 'Nie zaakceptowałes regulaminu',
            })

        if (!req.user.active)
            return res.send({
                error: true,
                response: 'Twoje konto nie zostało aktywowane.',
            })
        if (req.user.blocked)
            return res.send({
                error: true,
                response: 'Twoje konto jest zablokowane.',
            })

        cache.check(req.body.domain, exists => {
            if (exists)
                return res.send({
                    error: true,
                    response: 'Ta subdomena jest już zarejestrowana',
                })
            let data = req.body
            if (!data.proxied) data.proxied = false
            data.domain = data.domain + '.wszech.pl'
            cf.register(data.type, data.domain, data.record, data.proxied).then(
                response => {
                    if (!response.success)
                        return res.send({
                            error: true,
                            response: 'Wystąpił błąd przy tworzeniu subdomeny',
                        })
                    else {
                        db.query(
                            'INSERT INTO domains (owner, domain, record, recordType, proxied) VALUES (?, ?, ?, ?, ?)',
                            [
                                req.user.name,
                                data.domain,
                                data.record,
                                data.type.toUpperCase(),
                                data.proxied ? 1 : 0,
                            ],
                            err => {
                                if (err) {
                                    logger.error(
                                        `Domain creation error: ${err}`
                                    )
                                    return res.send({
                                        error: true,
                                        response:
                                            'Wystąpił błąd przy tworzeniu subdomeny. Skontaktuj się z administratorem',
                                    })
                                }
                                return res.send({
                                    error: false,
                                    response:
                                        'Pomyślnie utworzno subdomenę. Możesz teraz powrócić do <a href="../domains">listy domen</a>.',
                                })
                            }
                        )
                    }
                }
            )
        })
    })
}
