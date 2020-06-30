const mysql = require('mysql')
const {database} = require(__basedir + `/config`)
const logger = require('./logger')

let con
const init = () => {
    try {
        con = mysql.createPool(database)
        logger.info('Establishing database connection..')
        con.query('SELECT 1 + 1 AS solution', function(error, results) {
            if (error) {
                logger.error(`DB error: Couldn't connect to the database.`)
                return false
            }
            logger.info('Database connection established')
        })
    } catch (e) {
        logger.error(`DB error: ${e}`)
    }
}

const find = (domain, callback) => {
    try {
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
    } catch (e) {
        logger.error(`DB error: ${e}`)
    }
}

const list = (user, callback) => {
    try {
        con.query(
            'SELECT * FROM domains WHERE owner = ?',
            user,
            (err, result) => {
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
                            type: result[a]['recordType'],
                            record: result[a]['record'],
                            proxied: result[a]['proxied'],
                        })
                    }

                    resp.response = 'success'
                    resp.domains = list
                }

                callback(resp)
            }
        )
    } catch (e) {
        logger.error(`DB error: ${e}`)
    }
}

const query = (query, args, callback) => {
    try {
        if (args)
            con.query(query, args, (err, result) => {
                if (callback) callback(err, result)
            })
        else con.query(query, (err, result, fields) => {})
    } catch (e) {
        logger.error(`DB error: ${e}`)
    }
}

const getLimits = (req, callback) => {
    let user = req.user.name
    let accountType = req.user.accountType
    let domainsLimit = 0
    switch (accountType) {
        case 0:
            domainsLimit = 5
            break
        case 1:
            domainsLimit = 10
            break
        default:
            domainsLimit = 255
            break
    }
    list(user, domainsList => {
        const domainsCount = domainsList.domains.length
        callback({error: false, domainsLimit, domainsCount})
    })
}

exports.getLimits = getLimits
exports.init = init
exports.find = find
exports.query = query
exports.list = list
exports.user = require('./user')
