const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const md5 = require('md5')
const db = require(__basedir + '/inc/db')

const accountTypes = [
    {name: 'Basic', limit: 5},
    {name: 'Premium', limit: 10},
    {name: 'Unlimited', limit: 0},
]

module.exports = (req, res) => {
    db.query(
        'SELECT count(*) as total FROM domains WHERE owner = ?',
        req.user.name,
        (err, result) => {
            res.render('panel/main', {
                title: title,
                view: 'overview',
                page: 'Podsumowanie',
                nick: req.user.name,
                avatarHash: md5(req.user.mail.toString().toLowerCase()),
                nav: navLinks,
                domainCount: result[0]['total'],
                limit: accountTypes[req.user.accountType]['limit'], //<i class="fal fa-infinity"></i>
                accountType: accountTypes[req.user.accountType]['name'],
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
                        name: 'Ustawienia',
                        href: 'settings',
                        icon: 'fal fa-cog',
                    },
                ],
                messages: req.flash('activationMailMessage'),
            })
        }
    )
}
