const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');


const mainRouter = require('./routes/')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(cookieParser('loftschool'));
app.use(session({
  secret: 'loftschool',
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  saveUninitialized: false,
  resave: false
  }));
  
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => {})
