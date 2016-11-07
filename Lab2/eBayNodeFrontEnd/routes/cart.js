"use strict"
var ejs = require("ejs");
var logging = require('./logging');
var mq_client = require('../rpc/client');

function addToCart(req,res)
{
	if(req.session.username)
	{
		 //
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		mq_client.make_request('addToCart', {"username":req.session.username,"itemObjectId":req.session.itemObjectId,"orderedQuantity":1}, function(err, results)
				{
					console.log(results);
					if (err)
					{
						throw err;
					}
					else
					{
						if(results.code == 200)
						{
							logging.logger.log('info', req.session.username + "  | Item added to cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.send({"statusCode":200});
							res.end();	
						}
						else
						{
							logging.logger.log('info', req.session.username + "  | Unable to add item to cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.send({"statusCode":401});
							res.end();
						}
					}
				});
	}
	else
	{
		res.redirect('/');
	}
}

function renderCart(req, res) {
	if (req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		ejs.renderFile('./views/cart.ejs', {"fname":req.session.fname,"lastLogged": new Date(req.session.lastLoggedIn).toLocaleString()},function(err,result) {
			if (!err) {
				res.end(result);
			} else {
				res.end("An error occured.");
				console.log(err);
			}
		});		
	}
	else
		{
		res.redirect('/');
		}
}

function getMycart(req, res) {
	if (req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var cartContent = [];
		req.session.cart = [];
		mq_client.make_request('getMycart', {"username":req.session.username}, function(error, response) {
			if (error) {
				throw error;
			} else {
				console.log(response);
				logging.logger.log('info', req.session.username
						+ "  | Viewed cart" + " | " + new Date().toString());
				var i = 0;
				var total = 0;
				
				//console.log(req.session.cart);
				for (i; i < response.cartItems.length; i++) {
					var json = {
						"itemId" : response.cartItems[i].itemId.itemRefId,
						"price" : response.cartItems[i].itemId.price,
						"itemName" : response.cartItems[i].itemId.itemName,
						"description" : response.cartItems[i].itemId.description,
						"seller" : response.cartItems[i].itemId.owner,
						"orderedquantity" : response.cartItems[i].orderedQuantity,
						"availquantity" : response.cartItems[i].itemId.quantity,
						"itemObjectId" : response.cartItems[i].itemId._id,
						//"state" : response[i].location
						
					};
					cartContent.push(json);
					console.log(json);
					total += Number((Number(response.cartItems[i].itemId.price))*(Number(response.cartItems[i].orderedQuantity)));
					console.log(total);
				}
				req.session.total = total;
				console.log(total);
				req.session.cart = cartContent; 
				logging.logger.log('info', req.session.username + "  | Viewed cart  | "  + new Date().toString());
				res.send({"cart" : cartContent,"total":total});
				res.end();
			}
		});
		
	}
	else
		{
		//redirect
		}
}

function removeFromCart(req,res)
{
	if(req.session.username)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		 //var queryData = url.parse(req.url, true).query;
		 //var quant = queryData.itemId;
		
		
		mq_client.make_request('removeFromCart', {"username":req.session.username,"itemId":req.param("itemId")}, function(err, results)
				{
					console.log(results);
					if (err)
					{
						throw err;
					}
					else
					{
						if(res.code == 200)
						{
							logging.logger.log('info', req.session.username + "  | Item removed from cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.send({"statusCode":200});
							res.end();	
						}
						else
						{
							logging.logger.log('info', req.session.username + "  | Unable to remove item from cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.send({"statusCode":401});
							res.end();
						}
					}
				});
	}
}

function updateCart(req,res)
{
	if(req.session.username)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		mq_client.make_request('updateCart', {"username":req.session.username,"itemObjectId":req.param("itemId"),"orderedQuantity":req.param("updatedquantity")}, function(err, results)
				{
					console.log(results);
					if (err)
					{
						throw err;
					}
					else
					{
						if(res.code == 200)
						{
							logging.logger.log('info', req.session.username + "  | updated quantity in cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.send({"statusCode":200});
							res.end();	
						}
						else
						{
							logging.logger.log('info', req.session.username + "  | Unable to update item from cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.send({"statusCode":401});
							res.end();
						}
					}
				});
		
					}
}
exports.updateCart = updateCart;
exports.getMycart = getMycart;
exports.renderCart = renderCart;
exports.addToCart = addToCart; 
exports.removeFromCart = removeFromCart;