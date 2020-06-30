const request = require('request')
const mail = require('../../inc/mail')
const {captcha} = require('../../config')

// Nie jest podpięte, można wyrzucić albo zostawić

module.exports = (req, res) => {
    if (
        !req.body['name'] ||
        !req.body['email'] ||
        !req.body['subject'] ||
        !req.body['message']
    )
        return res.send({error: true, response: 'One of fields is empty'})

    if (req.body['g-recaptcha-response']) {
        let recp = req.body['g-recaptcha-response']
        const userIp =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress

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
                if (err)
                    return res.send({
                        error: true,
                        response: "Couldn't verify captcha",
                    })
                else {
                    const fr = JSON.parse(body)
                    if (fr.success) {
                        // mail, user, title, content
                        mail.contact(
                            req.body['email'],
                            req.body['name'],
                            req.body['subject'],
                            req.body['message'].replace(
                                /(?:\r\n|\r|\n)/g,
                                '<br>'
                            ),
                            function(sent, error) {
                                if (sent) return res.send({success: true})
                                else
                                    return res.send({
                                        error: true,
                                        response: error,
                                    })
                            }
                        )
                    }
                }
            }
        )
    }
}
