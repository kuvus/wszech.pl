const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const flash = require('connect-flash')

global.__basedir = __dirname

const db = require('./inc/db')

require('./inc/passport')

db.init()

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const userRouter = require('./routes/user')
const infoRouter = require('./routes/info')
const adminRouter = require('./routes/admin')

const app = express()

app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(flash())
// app.use(bodyParser())

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

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/api', apiRouter)
app.use('/user', userRouter)
app.use('/info', infoRouter)
app.use('/admin', adminRouter)

// Catch 404
app.use(function(req, res, next) {
    res.status(404).render('errors/404')
})

module.exports = app
