const winston = require('winston')
const {combine, timestamp, printf} = winston.format

const format = printf(({level, message, timestamp}) => {
    return `${timestamp} | [${level.toUpperCase()}] ${message}`
})

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), format),
    transports: [
        new winston.transports.File({
            filename: __basedir + '/logs/error.log',
            level: 'error',
            maxsize: 5242880 * 2, // 5MB * 2
            maxFiles: 10,
        }),
        new winston.transports.File({
            filename: __basedir + '/logs/combined.log',
            maxsize: 5242880 * 2, // 5MB * 2
            maxFiles: 10,
        }),
        new winston.transports.Console(),
    ],
    handleExceptions: true,
    exitOnError: false,
})

module.exports = logger
