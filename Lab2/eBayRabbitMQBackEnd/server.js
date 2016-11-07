//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var user = require('./services/users');
var items = require('./services/items');
var checkout = require('./services/checkout');
var cart = require('./services/cart');
var transaction = require('./services/transaction');
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening.. ");
	cnn.queue('loginQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.handleRequestLogin(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
				console.log("published");
			});
		});
	});
});
var cnn1 = amqp.createConnection({host:'127.0.0.1'});
cnn1.on('ready', function(){	console.log("listening.. ");
cnn1.queue('getUser', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.handleRequestGetUser(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
				console.log("published");
			});
		});
	});
});	
var cnn2 = amqp.createConnection({host:'127.0.0.1'});
cnn2.on('ready', function(){console.log("listening.. ");
cnn2.queue('lastloggedInQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.handleRequestUpdateLastLoggin(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});	

var cnn3 = amqp.createConnection({host:'127.0.0.1'});
cnn3.on('ready', function(){console.log("listening.. ");
	cnn3.queue('registerQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.handleRequestRegistration(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn4 = amqp.createConnection({host:'127.0.0.1'});
cnn4.on('ready', function(){console.log("listening.. ");
	cnn4.queue('updateProfileQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.handleRequestUpdateProfile(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn5 = amqp.createConnection({host:'127.0.0.1'});
cnn5.on('ready', function(){console.log("listening.. ");
	cnn5.queue('getProfileQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.handleRequestGetProfile(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn6 = amqp.createConnection({host:'127.0.0.1'});
cnn6.on('ready', function(){console.log("listening.. ");
	cnn6.queue('getItemQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			items.handleRequestGetItem(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

var cnn7 = amqp.createConnection({host:'127.0.0.1'});
cnn7.on('ready', function(){console.log("listening.. ");
	cnn7.queue('addItemQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			items.handleRequestAddItem(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

var cnn8 = amqp.createConnection({host:'127.0.0.1'});
cnn8.on('ready', function(){console.log("listening.. ");
	cnn8.queue('getItemsQueue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			items.handleRequestGetItems(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn9 = amqp.createConnection({host:'127.0.0.1'});
cnn9.on('ready', function(){console.log("listening.. ");
	cnn9.queue('getCart', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			checkout.handleRequestGetCart(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn10 = amqp.createConnection({host:'127.0.0.1'});
cnn10.on('ready', function(){console.log("listening.. ");
	cnn10.queue('addToCart', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			cart.handleRequestAddToCart(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn11 = amqp.createConnection({host:'127.0.0.1'});
cnn11.on('ready', function(){console.log("listening.. ");
	cnn11.queue('getMycart', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			cart.handleRequestGetMycart(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

var cnn12 = amqp.createConnection({host:'127.0.0.1'});
cnn12.on('ready', function(){console.log("listening.. ");
	cnn12.queue('removeFromCart', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			cart.handleRequestRemoveFromCart(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn13 = amqp.createConnection({host:'127.0.0.1'});
cnn13.on('ready', function(){console.log("listening.. ");
	cnn13.queue('updateCart', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			cart.handleRequestUpdateCart(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn14 = amqp.createConnection({host:'127.0.0.1'});
cnn14.on('ready', function(){console.log("listening.. ");
	cnn14.queue('deleteCart', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			checkout.handleRequestDeleteCart(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn15 = amqp.createConnection({host:'127.0.0.1'});
cnn15.on('ready', function(){console.log("listening.. ");
	cnn15.queue('addTransaction', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			checkout.handleRequestAddTransaction(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn16 = amqp.createConnection({host:'127.0.0.1'});
cnn16.on('ready', function(){console.log("listening.. ");
	cnn16.queue('addOrders', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			checkout.handleRequestAddOrders(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn17 = amqp.createConnection({host:'127.0.0.1'});
cnn17.on('ready', function(){console.log("listening.. ");
	cnn17.queue('updateItems', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			checkout.handleRequestUpdateItems(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn18 = amqp.createConnection({host:'127.0.0.1'});
cnn18.on('ready', function(){console.log("listening.. ");
	cnn18.queue('getSoldTransactions', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			transaction.handleRequestGetSoldTransactions(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn19 = amqp.createConnection({host:'127.0.0.1'});
cnn19.on('ready', function(){console.log("listening.. ");
	cnn19.queue('getBoughtTransactions', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			transaction.handleRequestGetBoughtTransactions(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
var cnn20 = amqp.createConnection({host:'127.0.0.1'});
cnn20.on('ready', function(){console.log("listening.. ");
	cnn20.queue('getOrders', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			transaction.handleRequestGetOrders(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});