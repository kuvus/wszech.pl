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
            response: 'Nie podałes ID domeny do modyfikacji.',
        })
    if (!req.body.dnsType)
        return res.send({
            error: true,
            response: 'Nie podałes typu wpisu.',
        })
    if (!req.body.dnsRecord)
        return res.send({
            error: true,
            response: 'Nie podałes wartości wpisu.',
        })
    if (!req.body.proxied)
        return res.send({
            error: true,
            response: 'Nie wartości proxy',
        })
    if (!req.body.domainName)
        return res.send({
            error: true,
            response: 'Nie podałes nazwy domeny do modyfikacji.',
        })
    const username = req.user.name
    cache.get(req.body.domainName, cacheResult => {
        if (!cacheResult) {
            return res.send({
                error: true,
                response: 'Podana subdomena nie istnieje.',
            })
        } else {
            ;(async function() {
                let recordId = cacheResult.cfId
                let cfStatus = await cf.update(
                    recordId,
                    req.body.dnsType,
                    cacheResult.domain,
                    req.body.dnsRecord,
                    req.body.proxied
                )
                if (cfStatus) {
                    db.query(
                        'UPDATE domains SET recordType=?, record=?, proxied=? WHERE id=? AND owner=?',
                        [
                            req.body.dnsType,
                            req.body.dnsRecord,
                            req.body.proxied,
                            req.body.domainId,
                            username,
                        ],
                        (err, resp) => {
                            if (err) {
                                logger.error(
                                    `DB error while domain update: ${err}`
                                )
                                return res.send({
                                    error: true,
                                    response:
                                        'Wystąpił błąd. Skontaktuj się z administratorem.',
                                })
                            }
                            if (resp.affectedRows < 1)
                                return res.send({
                                    error: true,
                                    response:
                                        'Podana subdomena nie istnieje lub nie należy dociebie.',
                                })

                            return res.send({
                                error: false,
                                response: 'Pomyślnie zmodyfikowano subdomenę.',
                            })
                        }
                    )
                } else {
                    return res.send({
                        error: true,
                        response:
                            'Wystąpił błąd podczas modyfikowania subdomeny.',
                    })
                }
            })()
        }
    })
}
