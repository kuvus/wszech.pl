const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const md5 = require('md5')
const notification = require(__basedir + '/inc/notifications')

module.exports = (req, res) => {
    notification.getNotifications(req.user.name, notifications => {
        res.render('panel/main', {
            title: title,
            view: 'createDomain',
            page: 'Rejestracja subdomeny',
            nick: req.user.name,
            avatarHash: md5(req.user.mail.toString().toLowerCase()),
            nav: navLinks,
            side: [
                {
                    active: false,
                    name: 'Podsumowanie',
                    href: '/user/overview',
                    icon: 'fas fa-th',
                },
                {
                    active: true,
                    name: 'Lista domen',
                    href: '/user/domains',
                    icon: 'far fa-list-ul',
                },
                // {
                //     active: false,
                //     name: 'Ustawienia',
                //     href: '/user/settings',
                //     icon: 'fal fa-cog',
                // },
            ],
            domain: req.query.domain || false,
            notifications,
        })
    })
}
