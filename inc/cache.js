global.__basedir = __dirname + '/../'
const db = require(__basedir + '/inc/db')
const logger = require(__basedir + '/inc/logger')
const cacheWorker = require(__basedir + '/workers/cacher.js')

const update = () => {
    cacheWorker.refresh().then()
}

const check = (domain, callback) => {
    try {
        domain = domain + '.wszech.pl'
        db.query(
            'SELECT * FROM cache WHERE domain=?',
            domain,
            (err, result) => {
                if (err) logger.error(`Cache error: ${err}`)
                if (result !== undefined || result.length > 0) {
                    callback(result.length > 0)
                } else callback(false)
            }
        )
    } catch (e) {
        logger.error(`Cache error: ${e}`)
    }
}

const get = (domain, callback) => {
    try {
        domain = domain.includes('.wszech.pl') ? domain : domain + '.wszech.pl'
        db.query(
            'SELECT * FROM cache WHERE domain=?',
            domain,
            (err, result) => {
                if (err) logger.error(`Cache error: ${err}`)
                if (result !== undefined || result.length > 0) {
                    callback(result[0])
                } else callback(false)
            }
        )
    } catch (e) {
        logger.error(`Cache error: ${e}`)
    }
}

exports.update = update
exports.check = check
exports.get = get
