const cache = require(__basedir + '/inc/cache.js')
const {captcha} = require(__basedir + '/config')

module.exports = (req, res) => {
    if (!req.body.domain)
        return res.send({error: true, response: 'Domain name is not specified'})
    cache.check(req.body.domain, exists => {
        return res.send({
            exists,
        })
    })
}
