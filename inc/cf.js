const {cloudflare} = require(__basedir + '/config')
const logger = require(__basedir + '/inc/logger')
const cf = require('cloudflare')({
    email: cloudflare.mail,
    key: cloudflare.key,
})

exports.exists = async name => {
    const res = await cf.dnsRecords.browse(cloudflare.zone)
    const result = res.result

    for (let count in result) if (result[count].name === name) return true
    return false
}

exports.register = async (type, name, content, proxied) => {
    if (!type) return {success: false, errors: 'Type field is empty'}
    if (!name) return {success: false, errors: 'Name field is empty'}
    if (!content) return {success: false, errors: 'Content field is empty'}
    // if (await ifExists(name))
    //     return {success: false, errors: 'Domain already exists'}

    proxied = proxied === 'true'

    try {
        return await cf.dnsRecords.add(cloudflare.zone, {
            type,
            name,
            content,
            ttl: 1,
            proxied,
        })
    } catch (e) {
        logger.error(`CF error: ${e}`)
        return false
    }
}

exports.delete = async recordId => {
    try {
        return await cf.dnsRecords.del(cloudflare.zone, recordId)
    } catch (e) {
        logger.error(`CF error: ${e}`)
        return false
    }
}

exports.update = async (recordId, type, name, content, proxied) => {
    try {
        return await cf.dnsRecords
            .edit(cloudflare.zone, recordId, {
                type,
                name,
                content,
                ttl: 1,
                proxied: Boolean(proxied),
            })
            .then(e => {
                return true
            })
            .catch(e => {
                logger.error(`CF error: ${e}`)
                return false
            })
    } catch (e) {
        logger.error(`CF error: ${e}`)
        return false
    }
}
