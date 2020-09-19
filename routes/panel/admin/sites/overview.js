const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const md5 = require('md5')
const db = require(__basedir + '/inc/db')
const notification = require(__basedir + '/inc/notifications')

module.exports = (req, res) => {
    notification.getNotifications(req.user.name, (notifications) => {
        db.query(
            'SELECT count(*) as total FROM domains',
            req.user.name,
            (err, domainCount) => {
                db.query(
                    'SELECT count(*) as total FROM users',
                    [],
                    (err, userCount) => {
                        res.render('panel/main', {
                            title: title,
                            view: 'overview',
                            viewType: 'admin',
                            page: 'Podsumowanie',
                            nick: req.user.name,
                            avatarHash: md5(
                                req.user.mail.toString().toLowerCase()
                            ),
                            nav: navLinks,
                            userCount: userCount[0]['total'],
                            domainCount: domainCount[0]['total'],
                            side: [
                                {
                                    active: true,
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
                                    active: false,
                                    name: 'Lista użytkowników',
                                    href: 'users',
                                    icon: 'fas fa-users',
                                },
                            ],
                            messages: req.flash('activationMailMessage'),
                            notifications,
                        })
                    }
                )
            }
        )
    })
}
