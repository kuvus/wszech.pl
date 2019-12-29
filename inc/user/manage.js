const db = require('../db')
const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegex = /^[a-zA-Z0-9ąĆćĘęŁłŃńÓóŚśŹźŻż]+$/u

exports.find = (name, callback) => {
    if (name) return db.query('SELECT * FROM users WHERE name = ?', name, callback)
    else return false
}

exports.check = (user, callback) => {
    if (mailRegex.test(user)) {
        try {
            db.query('SELECT * FROM users WHERE mail = ?', user, callback)
            return true
        } catch (e) {
            return false
        }
    } else if (nameRegex.test(user)) {
        try {
            db.query('SELECT * FROM users WHERE name = ?', user, callback)
            return true
        } catch (e) {
            return false
        }
    } else return false
}
