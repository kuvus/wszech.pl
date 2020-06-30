const cache = require(__basedir + '/inc/cache.js')
const logger = require(__basedir + '/inc/logger')
const db = require(__basedir + '/inc/db')
const {captcha} = require(__basedir + '/config')
const cf = require(__basedir + '/inc/cf')

module.exports = (req, res) => {
    if (!req.isAuthenticated())
        return res.send({error: true, response: 'Nie jesteś zalogowany'})
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
    if (!req.body.domainId)
        return res.send({
            error: true,
            response: 'Nie podałes ID domeny do usunięcia.',
        })
    const username = req.user.name
    db.query(
        'SELECT * FROM domains WHERE id=? AND owner=?',
        [req.body.domainId, username],
        (err, resp) => {
            if (err) {
                logger.error(`DB error while domain removal: ${err}`)
                return res.send({
                    error: true,
                    response:
                        'Wystąpił błąd. Skontaktuj się z administratorem.',
                })
            } else {
                if (resp.length < 1) {
                    return res.send({
                        error: true,
                        response:
                            'Podana subdomena nie istnieje lub nie należy do ciebie.',
                    })
                } else {
                    resp = resp[0]
                    cache.get(resp.domain, result => {
                        if (!result) {
                            return res.send({
                                error: true,
                                response:
                                    'Podana subdomena nie istnieje lub nie należy do ciebie.',
                            })
                        } else {
                            let recordId = result.cfId
                            if (cf.delete(recordId)) {
                                cache.update()
                                db.query(
                                    'DELETE FROM domains WHERE id=? AND owner=?',
                                    [req.body.domainId, username],
                                    err => {
                                        if (err)
                                            return res.send({
                                                error: true,
                                                response:
                                                    'Wystąpił błąd podczas usuwania subdomeny.',
                                            })
                                        else
                                            return res.send({
                                                error: false,
                                                response:
                                                    'Pomyslnie usunięto subdomenę.',
                                            })
                                    }
                                )
                            } else {
                                return res.send({
                                    error: true,
                                    response:
                                        'Wystąpił błąd podczas usuwania subdomeny.',
                                })
                            }
                        }
                    })
                }
            }
        }
    )
}
