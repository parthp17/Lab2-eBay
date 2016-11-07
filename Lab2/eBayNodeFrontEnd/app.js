
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , render = require('./routes/render')
  , users = require('./routes/users')
  , home = require('./routes/home')
  , sell = require('./routes/sell')
  ,item = require('./routes/item')
  ,cart = require('./routes/cart')
  ,checkout = require('./routes/checkout')
  ,handler = require('./routes/handler.js')
  ,passport = require('passport')
  ,LocalStrategy = require('passport-local').Strategy;

var mongoSessionConnectURL = "mongodb://localhost:27017/login";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongoose = require("mongoose");
var mq_client = require('./rpc/client');
var logging = require('./routes/logging');
var dateTime = require('./routes/DateTime');

var app = express();

app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
}



app.get('/', render.renderSignIn);
app.get('/index', routes.index);
app.get('/signIn', isAuthenticated, render.renderSignIn);
app.get('/register', render.renderRegister);
app.post('/logIn',users.logIn);


app.post('/signUp', users.signUp);
app.get('/signOut', users.signOut);
app.get('/profile',render.renderProfile);
app.post('/updateProfile',users.updateProfile);
app.get('/getProfile',users.getProfile);
app.get('/home',render.getHome);
app.get('/getHomeValues',home.getHomeValues);
app.get('/sell',render.sell);
app.get('/sell_info',render.sell_info);
app.get('/sellReview',render.sellReview)
app.post('/addItem',sell.sellReview);
app.post('/sellInfo',sell.sellInfo);
app.get('/item',item.getItem);
app.post('/addToCart',cart.addToCart);
app.get('/cart',cart.renderCart);
app.get('/getMycart',cart.getMycart);
app.post('/updateCart',cart.updateCart);
app.post('/removeFromCart',cart.removeFromCart);
app.get('/checkout',checkout.renderCheckOut);
app.post('/makeTransaction',checkout.buy);
app.get('/validateCart',checkout.validateCartQuant);
app.get('/btransactions',handler.getBoughtTransactions);
app.get('/stransactions',handler.getSoldTransactions);
app.get('/:username',function(req,res){
	if(req.session.username)
	render.renderHandle(req,res);
	else{
		render.renderSignIn(req,res);
	}
});

function isAuthenticated(req, res, next) {console.error("4");
	  if(req.session.user) {
	     console.log(req.session.user);
	     return next();
	  }

	  res.redirect('/');
	};

	// catch 404 and forward to error handler
app.use(function(req, res, next) {console.error("5");
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
});

app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});


mongoose.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});