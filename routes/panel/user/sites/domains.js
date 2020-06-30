const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const db = require(__basedir + '/inc/db')
const md5 = require('md5')
const notification = require(__basedir + '/inc/notifications')

module.exports = (req, res) => {
    notification.getNotifications(req.user.name, notifications => {
        db.list(req.user.name, domains => {
            res.render('panel/main', {
                title: title,
                view: 'domains',
                domains: domains.domains,
                page: 'Lista domen',
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
                        active: true,
                        name: 'Lista domen',
                        href: 'domains',
                        icon: 'far fa-list-ul',
                    },
                    // {
                    //     active: false,
                    //     name: 'Ustawienia',
                    //     href: 'settings',
                    //     icon: 'fal fa-cog',
                    // },
                ],
                notifications,
            })
        })
    })
}
