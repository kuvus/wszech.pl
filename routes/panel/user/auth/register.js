const auth = require(__basedir + '/inc/user/auth')
const logger = require(__basedir + '/inc/logger')

exports.get = (req, res) => {
    res.render('panel/auth', {
        title: 'Rejestracja',
        type: 'signup',
        main: false,
        messages: req.flash('loginMessage'),
    })
}

exports.post = async (req, res) => {
    let mail = req.body.email
    let name = req.body.name
    let password = req.body.password
    let terms = req.body.terms

    if (!terms) {
        req.flash(
            'loginMessage',
            `{"state": "danger", "message": "Nie zaakceptowałeś regulaminu."}`
        )
        res.redirect('/user/register')
    }

    await auth.create(name, password, mail, async response => {
        if (response.success) {
            logger.info(
                `New user account created: ${mail} - ${name} - ${req.ip}`
            )
            req.flash(
                'loginMessage',
                '{"state": "success", "message": "Pomyślnie utworzono konto! Przed zalogowaniem musisz je aktywować linkiem w mailu."}'
            )
            res.redirect('/user/login')
        } else {
            req.flash(
                'loginMessage',
                `{"state": "danger", "message": "${response.message}"}`
            )
            res.redirect('/user/register')
        }
    })
}
