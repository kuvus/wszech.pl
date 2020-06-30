const noti = require(__basedir + '/inc/notifications')

module.exports = (req, res) => {
    if (!req.isAuthenticated())
        return res.json({error: true, response: 'Nie jesteś zalogowany'})

    if (!req.body.notificationID)
        return res.json({error: true, response: 'Nie podałeś ID powiadomienia'})

    noti.markRead(req.user.name, req.body.notificationID)
    res.json({error: false})
}
