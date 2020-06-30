module.exports = (req, res) => {
    req.query.redirectTo
        ? res.cookie('redirectTo', req.query.redirectTo, {
              maxAge: 1 * 60 * 60 * 1000,
          })
        : res.cookie('redirectTo', '', {
              maxAge: 1,
          })
    res.render('panel/auth', {
        title: 'Logowanie',
        type: 'signin',
        main: false,
        messages: req.flash('loginMessage'),
    })
}
