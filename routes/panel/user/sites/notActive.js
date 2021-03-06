const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const md5 = require('md5')
const notification = require(__basedir + '/inc/notifications')

module.exports = (req, res) => {
    notification.getNotifications(req.user.name, notifications => {
        res.render('panel/main', {
            title: title,
            view: 'notActive',
            page: 'Aktywuj swoje konto',
            nick: req.user.name,
            avatarHash: md5(req.user.mail.toString().toLowerCase()),
            nav: navLinks,
            side: [
                {
                    active: true,
                    name: 'Konto nieaktywne',
                    href: '#',
                    icon: 'far fa-ban',
                },
            ],
            messages: req.flash('activationMailMessage'),
            notifications,
        })
    })
}
