const sgMail = require('@sendgrid/mail')
const {sendgrid} = require(__basedir + '/config')
const logger = require('./logger')

const mailRegex = new RegExp(
    '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'
)

sgMail.setApiKey(sendgrid.api)

const activation = async (mail, user, code, callback) => {
    if (!mailRegex.test(mail)) return callback(false, 'Błędny adres e-mail')
    const message = {
        from: {
            email: sendgrid.mail,
            name: sendgrid.mailName,
        },
        to: mail,
        subject: `Wszech.pl - Potwierdzenie rejestracji`,
        templateId: 'd-7905d808daad44d8a9a65ee85727a2ce',
        dynamic_template_data: {
            subject: 'Wszech.pl - Potwierdzenie rejestracji',
            userName: user,
            confirmationCode: code,
        },
    }

    sgMail
        .send(message)
        .then(() => {
            callback(true, '')
        })
        .catch(error => {
            logger.error(`Mail send error: ${error}`)
            callback(false, error)
        })
}

exports.activation = activation
