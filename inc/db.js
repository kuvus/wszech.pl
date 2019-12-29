const mysql = require('mysql')
const {database} = require(__basedir + `/config`)
const logger = require('./logger')

let con
const init = () => {
    try {
        con = mysql.createConnection(database)
        con.connect(err => {
            if (err) {
                logger.error(`DB error: ${err} - ${Date.now()}`)
                console.error(err)
                return false
            } else console.log('Connected')
        })
    } catch (e) {
        console.error(`An error occurred: ${e}`)
    }
}

const find = (domain, callback) => {
    con.query(
        'SELECT * FROM domains WHERE domain = ?',
        domain,
        (err, result) => {
            let resp = {}
            if (err) {
                resp.error = true
                resp.response = 'An error with database occurred'
            }

            if (result === undefined || result.length === 0) {
                resp.response = 'success'
                resp.exists = false
            } else {
                resp.response = 'success'
                resp.exists = true
            }

            callback(resp)
        }
    )
}

const list = (user, callback) => {
    con.query('SELECT * FROM domains WHERE owner = ?', user, (err, result) => {
        let resp = {}
        if (err) {
            resp.error = true
            resp.response = 'An error with database occurred'
        }

        const list = []

        if (result === undefined || result.length === 0) {
            resp.response = 'success'
            resp.domains = []
        } else {
            for (let a in result) {
                list.push({
                    domain: result[a]['domain'],
                    time: result[a]['timestamp'],
                    id: result[a]['id'],
                    renew: result[a]['renew'],
                })
            }

            resp.response = 'success'
            resp.domains = list
        }

        callback(resp)
    })
}

const query = (query, args, callback) => {
    if (args)
        con.query(query, args, (err, result) => {
            if (callback) callback(err, result)
        })
    else con.query(query, (err, result, fields) => {})
}

const checkExistence = (name, mail, callback) => {
    if (name && mail && callback) {
        query('SELECT * FROM users WHERE name = ?', name, (err, result) => {
            if (result.length > 0) return callback({exists: true, type: 'name'})
            query(
                'SELECT * FROM users WHERE mail = ?',
                mail,
                (err2, result2) => {
                    if (result2.length > 0)
                        return callback({exists: true, type: 'mail'})
                    else return callback({exists: false})
                }
            )
        })
    } else {
        return false
    }
}

exports.init = init
exports.find = find
exports.query = query
exports.list = list
exports.checkExistence = checkExistence
exports.user = require('./user')
