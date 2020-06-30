const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const md5 = require('md5')
const notification = require(__basedir + '/inc/notifications')

module.exports = (req, res) => {
    notification.getNotifications(req.user.name, notifications => {
        res.render('panel/main', {
            title: title,
            view: 'settings',
            page: 'Ustawienia',
            user: req.user,
            nick: req.user.name,
            avatarHash: md5(req.user.mail.toString().toLowerCase()),
            nav: navLinks,
            side: [
                {
                    active: false,
                    name: 'Podsumowanie',
                    href: 'overview',
                    icon: 'fas fa-th',
                },
                {
                    active: false,
                    name: 'Lista domen',
                    href: 'domains',
                    icon: 'far fa-list-ul',
                },
                {
                    active: true,
                    name: 'Ustawienia',
                    href: 'settings',
                    icon: 'fal fa-cog',
                },
            ],
            notifications,
        })
    })
}
