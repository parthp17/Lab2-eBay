
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , render = require('./routes/render')
  , users = require('./routes/users')
  , session = require('client-sessions')
  , home = require('./routes/home')
  , sell = require('./routes/sell')
  ,item = require('./routes/item')
  ,cart = require('./routes/cart')
  ,checkout = require('./routes/checkout')
  ,handler = require('./routes/handler.js')
  ,mysql = require('./routes/mysql.js');

var app = express();

// all environments
app.use(session({   
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

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
  app.use(express.errorHandler());
}
app.get('/', render.renderSignIn);
app.get('/index', routes.index);
app.get('/users', user.list);
app.get('/signIn', render.renderSignIn);
app.get('/register', render.renderRegister);
app.post('/logIn', users.logIn);
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
mysql.createPool();

http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});