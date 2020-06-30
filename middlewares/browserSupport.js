module.exports = function(req, res, next) {
    if (req.url.includes('img') || req.url.includes('css')) return next()
    const userAgent = req.get('User-Agent').toLowerCase()
    if (userAgent.includes('msie') || userAgent.includes('trident')) {
        return res.render('unsupported')
    } else next()
}
