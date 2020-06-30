const config = require(__basedir + '/config')['matomo']
const MatomoTracker = require('matomo-tracker')
const matomo = new MatomoTracker(2, config.url)
const logger = require(__basedir + '/inc/logger')

matomo.on('error', function(err) {
    logger.error(`Matomo error: ${err}`)
})

module.exports = async function(req, res, next) {
    if (
        req.url.includes('/img') ||
        req.url.includes('/css') ||
        req.url.includes('/js') ||
        req.url.includes('/api')
    )
        return next()
    let url = req.protocol + '://' + req.header('Host') + req.originalUrl
    await matomo.track({
        url,
        ua: req.get('User-Agent'),
        lang: req.get('Accept-Language'),
        token_auth: config.token,
        cip: req.get('CF-Connecting-IP') ? req.get('CF-Connecting-IP') : req.ip,
        urlref: req.header('Referer'),
    })
    next()
}
