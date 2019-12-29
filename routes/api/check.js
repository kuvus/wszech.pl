const request = require('request')
const db = require('../../inc/db')
const {captcha} = require('../../config')

module.exports = (req, res) => {
    if (req.body.domain) {
        let domain = req.body.domain
        if (req.body['g-recaptcha-response']) {
            let recp = req.body['g-recaptcha-response']
            const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            const postData = {
                secret: captcha.secret,
                response: recp,
                remoteip: userIp,
            }

            request.post(
                {
                    url: 'https://www.google.com/recaptcha/api/siteverify',
                    formData: postData,
                },
                function(err, httpResponse, body) {
                    if (err) return res.send({error: true, response: "Couldn't verify captcha"})
                    else {
                        const fr = JSON.parse(body)
                        if (fr.success) {
                            db.find(domain, function(data) {
                                res.send(JSON.stringify(data))
                            })
                        }
                    }
                }
            )
        } else res.send({error: true, response: "Captcha hasn't been completed"})
    } else res.send({error: true, response: 'Domain name is not specified'})
}
