global.__basedir = __dirname + '/../'
const {cloudflare} = require('../config')
const cf = require('cloudflare')({
    email: cloudflare.mail,
    key: cloudflare.key,
})
const db = require('../inc/db')
const logger = require('../inc/logger')

async function refresh() {
    db.init()
    db.query('DELETE FROM cache')

    const zone = await cf.dnsRecords.browse(cloudflare.zone)
    const domains = zone.result

    let domainsFiltered = []
    let domainsNames = []

    for (let i in domains) {
        if (!domainsNames.includes(domains[i].name)) {
            domainsFiltered.push({
                domain: domains[i].name,
                recordType: domains[i].type,
                proxied: domains[i].proxied,
                id: domains[i].id,
            })
            domainsNames.push(domains[i].name)
        }
    }

    if (domainsFiltered.length > 0) {
        for (let a in domainsFiltered) {
            let domain = domainsFiltered[a]
            db.query(
                'INSERT INTO cache (domain, recordType, proxied, cfId) VALUES (?,?,?,?)',
                [domain.domain, domain.recordType, domain.proxied, domain.id],
                e => {
                    if (e) logger.error(`Worker error: ${e}`)
                }
            )
        }
    }
    logger.info('Finished updating cache.')

    if (!module.parent) {
        process.exit()
    }
}
refresh()
exports.refresh = refresh
