const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const flash = require('connect-flash')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const config = require('./config')
const acceptWebp = require('accept-webp')

global.__basedir = __dirname

const matomo = require('./middlewares/matomo')
const browserSupport = require('./middlewares/browserSupport')
const adminRestriction = require('./middlewares/adminRestriction')

const allLimiter = rateLimit({
    windowMs: 5000,
    max: 15,
    message: '(╯°□°)╯︵ ┻━┻ Bruh, za szybko odświeżasz.',
})

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        error: true,
        response:
            'Przekroczyłes limit zapytań do API. Poczekaj chwilę i spróbuj ponownie.',
    },
})

const winston = require('./inc/logger')

winston.info(`
                           _             _ 
                          | |           | |
__      _____ _______  ___| |__    _ __ | |
\\ \\ /\\ / / __|_  / _ \\/ __| '_ \\  | '_ \\| |
 \\ V  V /\\__ \\/ /  __/ (__| | | |_| |_) | |
  \\_/\\_/ |___/___\\___|\\___|_| |_(_) .__/|_|
                                  | |      
                                  |_|       `)
winston.info('Starting wszech.pl..')

const db = require('./inc/db')

require('./inc/passport')

db.init()

winston.info('Loading routes..')

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const userRouter = require('./routes/user')
const infoRouter = require('./routes/info')
const adminRouter = require('./routes/admin')

winston.info('Successfully loaded routes')

const app = express()

app.set('trust proxy', 1)
app.use(helmet())
if (config.requestLogging) app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(flash())
app.use(compression())

app.use(
    session({
        resave: false,
        secret: 'wszech jes fajen',
        cookie: {maxAge: 604800000},
        saveUninitialized: true,
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(browserSupport)
app.use(matomo)

app.use(acceptWebp(path.join(__dirname, 'public'), ['jpg', 'jpeg', 'png']))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', allLimiter, indexRouter)
app.use('/api', apiLimiter, apiRouter)
app.use('/user', allLimiter, userRouter)
app.use('/info', allLimiter, infoRouter)
app.use('/admin', adminRestriction, adminRouter)

// Catch 404
app.use(function(req, res) {
    res.status(404).render('errors/404')
})

module.exports = app
