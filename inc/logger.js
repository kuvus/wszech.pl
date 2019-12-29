const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
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
    ],
    handleExceptions: true,
    exitOnError: false,
})

module.exports = logger
