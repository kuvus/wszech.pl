const request = require('request')
const db = require(__basedir + '/inc/db')
const {hcaptcha} = require(__basedir + '/config')

module.exports = (req, res) => {
    if (!req.body.domain)
        return res.send({error: true, response: 'Domain name is not specified'})
    if (!req.body['g-recaptcha-response'])
        return res.send({
            error: true,
            response: "Captcha hasn't been completed",
        })

    const userIp =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress

    const postData = {
        secret: hcaptcha.secret,
        response: req.body['h-captcha-response'],
        remoteip: userIp,
    }

    request.post(
        {
            url: 'https://hcaptcha.com/siteverify',
            formData: postData,
        },
        function(err, httpResponse, body) {
            if (err)
                return res.json({
                    error: true,
                    response: "Couldn't verify captcha",
                })
            else {
                const fr = JSON.parse(body)
                if (fr.success) {
                    db.find(req.body.domain, function(data) {
                        res.json(data)
                    })
                } else {
                    return res.json({
                        error: true,
                        response: "Couldn't verify captcha",
                    })
                }
            }
        }
    )
}
