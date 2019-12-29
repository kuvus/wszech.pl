module.exports = (req, res) => {
    res.render('panel/auth', {
        title: 'Logowanie',
        type: 'signin',
        main: false,
        messages: req.flash('loginMessage'),
    })
}
