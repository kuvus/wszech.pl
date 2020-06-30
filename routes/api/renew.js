const request = require('request')
const db = require(__basedir + '/inc/db')

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
    if (!req.body.domain)
        return res.send({
            error: true,
            response: 'Nie podałeś nazwy subdomeny',
        })

    let domain = req.body.domain

    db.query(
        'SELECT renew,timestamp FROM domains WHERE owner=? AND domain=?',
        [req.user.name, domain],
        (err, resp) => {
            if (err)
                return res.json({
                    error: true,
                    response:
                        'Wystąpił błąd przy przedłużaniu domeny. Skontaktuj się z administratorem.',
                })
            if (res.length < 1)
                return res.json({
                    error: true,
                    response:
                        'Wystąpił błąd przy przedłużaniu domeny. Skontaktuj się z administratorem.',
                })

            let currentRenew = resp[0].renew
            let registrationDate = resp[0].timestamp
            // RowDataPacket { renew: 6, timestamp: 2020-04-26T20:29:35.000Z }
            let renewDate = new Date(registrationDate)
            renewDate = new Date(
                renewDate.setMonth(renewDate.getMonth() + currentRenew)
            )

            if ((renewDate.getTime() - Date.now()) / 1000 / 60 / 60 / 24 > 35)
                return res.json({
                    error: true,
                    response:
                        'Subdomenę można odnowić miesiąc przed końcem ważności.',
                })
            db.query(
                'UPDATE domains SET renew=? WHERE owner=? AND domain=?',
                [currentRenew + 6, req.user.name, domain],
                (e, r) => {
                    if (e)
                        return res.json({
                            error: true,
                            response:
                                'Wystąpił błąd przy przedłużaniu domeny. Skontaktuj się z administratorem.',
                        })
                    return res.json({
                        error: false,
                        response: 'Pomyślnie przedłużono subdomenę.',
                    })
                }
            )
        }
    )
}
