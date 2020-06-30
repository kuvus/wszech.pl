const db = require('./db')

exports.getNotifications = (user, callback) => {
    db.query(
        'SELECT * FROM notifications WHERE user=? ORDER BY id desc',
        [user],
        (err, response) => {
            if (err) return callback({error: true})

            if (response.length < 1) return callback({notifications: []})

            callback({notifications: response})
        }
    )
}

exports.markRead = (user, id) => {
    if (id === 'all') {
        db.query(
            "UPDATE `notifications` SET `read`='1' WHERE user=?",
            [user],
            () => {}
        )
    } else {
        db.query(
            "UPDATE `notifications` SET `read`='1' WHERE user=? AND id=?",
            [user, id],
            () => {}
        )
    }
}
