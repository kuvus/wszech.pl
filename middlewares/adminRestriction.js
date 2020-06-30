module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.render('restrictedAccess')
    }

    if (req.user.permissions >= 2) {
        next()
    } else {
        return res.render('restrictedAccess')
    }
}
