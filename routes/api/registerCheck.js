const cache = require(__basedir + '/inc/cache.js')
const {captcha} = require(__basedir + '/config')

module.exports = (req, res) => {
    if (!req.body.domain)
        return res.send({error: true, response: 'Nie podałeś nazwy subdomeny'})
    if (req.body.domain.length < 2)
        return res.send({
            error: true,
            response: 'Podana subdomena jest zbyt krótka',
        })
    cache.check(req.body.domain, (exists) => {
        return res.send({
            exists,
        })
    })
}
