const settings = require('./settings.json')
const title = settings.title
const navLinks = settings.navLinks
const md5 = require('md5')

module.exports = (req, res) => {
    res.render('panel/main', {
        title: title,
        view: 'blocked',
        page: 'Twoje konto zostało zablokowane',
        nick: req.user.name,
        avatarHash: md5(req.user.mail.toString().toLowerCase()),
        nav: navLinks,
        side: [
            {
                active: true,
                name: 'Konto zablokowane',
                href: '#',
                icon: 'far fa-ban',
            },
        ],
    })
}
