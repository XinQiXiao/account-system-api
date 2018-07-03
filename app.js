
let express = require('express')
let compression = require('compression')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let systemConfig = require('./config')

mongoose.connect(systemConfig.mongooseConnect, { useMongoClient: true })

// router
let routesAuth = require('./routes')
let system = require('./routes/system')
let products = require('./routes/products')

let app = express()
// trust first proxy
app.set('trust proxy', 1)
app.use(session({ 
	name: 'accountSession',
	secret: 'account system', 
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false, maxAge: 600000, httpOnly:false, secure:false },
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(compression())

app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../upload')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (app.get('env') === 'development') {
	app.use(function (req, res, next) {

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true)

		// Pass to next layer of middleware
		next()
	})
}

//统一权限拦截
app.use(routesAuth)
app.use('/system', system)
app.use('/api/products', products)

// 确保react-router刷新正确路由
app.get('*', function (request, response) {
	response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	let err = new Error('Not Found')
	err.status = 404
	next(err)
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500)
		res.render('error', {
			message: err.message,
			error: err
		})
	})
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500)
	res.render('error', {
			message: err.message,
			error: {}
	})
})

module.exports = app