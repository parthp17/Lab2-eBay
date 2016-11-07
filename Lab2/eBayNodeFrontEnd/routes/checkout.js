"use strict"
var ejs = require("ejs");
//var mysql = require('./mysql');
var logging = require('./logging');
var cart = require('./cart');
var dateTime = require('./DateTime');
var message;
var mq_client = require('../rpc/client');


function CreditCard(cardNumber,cvvNumber,validTillMonth, validTillYear)
{
	this.cardNumber = cardNumber;
	this.cvvNumber =cvvNumber;
	this.validTillMonth = validTillMonth;
	this.validTillYear = validTillYear;
}

function regexTest(regex, value)
{
	if (regex.test(value))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function doValidations(objCreditCard)
{
	
	var regexMonth = /^(0?[1-9]|1[0-2])$/;
	var regexYear = /^[0-9]{4}$/;
	var regexCard = /^(?=[0-9]*$)(?:.{11}|.{14}|.{15}|.{16})$/;
	var regexCvv = /^[0-9]{3,4}$/;
	if(regexTest(regexMonth, objCreditCard.validTillMonth) && 
			regexTest(regexYear, objCreditCard.validTillYear) && 
			regexTest(regexCard, objCreditCard.cardNumber) && 
			regexTest(regexCvv, objCreditCard.cvvNumber))
	{
		var currentDate = new Date();
		var bValidate = false;
		if(objCreditCard.validTillYear < currentDate.getFullYear())
		{
			
			return false;
		}
		else if (objCreditCard.validTillYear == currentDate.getFullYear() && 
				objCreditCard.validTillMonth <= currentDate.getMonth())
		{
			return false;
		}
		else
		{	
			if(objCreditCard.cardNumber.length == 16 && objCreditCard.cvvNumber.length == 3)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	else
	{	
		
		return false;
	}
}

function validateCart(req,res)
{
	if(req.session.username && req.session.cart.length !== 0)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
var cart = req.session.cart;
		
		mq_client.make_request('getMycart', {"username":req.session.username}, function(err, results)
				{
					if(err)
					{
						throw err;
					}
					else if(results.code == 200)
					{
						var i = 0;
						for(i;i<results.cartItems.length;i++)
						{
							if(results.cartItems[i].itemId.quantity >= results.cartItems[i].orderedQuantity)
							{
								continue;
							}
							return results.cartItems[i].itemId.itemRefId;
						}
						return 0;
					}
					else
					{
						return 1;
					}
				});
		/*var cart = req.session.cart;
		getCart
		
			var itemQuery = "select * from items,cart where cart.itemId = items.itemId and cart.username = '" + req.session.username + "'";
			mysql.getData(function(error, response) {
				if(error)
				{
					throw error;
				}
				else
				{
					var i =0;
					for(i;i<response.length;i++)
					{
						if(response[i].quantity >= response[i].orderedquantity)
						{
							
							continue;
						}
						return response[i].itemId;
					}
					return 0;
				}
			},itemQuery);*/
	}
}

function validateCartQuant(req,res)
{
	if(req.session.username && req.session.cart.length !== 0)
	{	
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var cart = req.session.cart;
		
		mq_client.make_request('getMycart', {"username":req.session.username}, function(err, results)
				{
					if(err)
					{
						throw err;
					}
					else if(results.code == 200)
					{
						var i = 0;
						for(i;i<results.cartItems.length;i++)
						{
							if(results.cartItems[i].itemId.quantity >= results.cartItems[i].orderedQuantity)
							{
								continue;
							}
							
							res.send({"statusCode" : 404,"itemId" : results.cartItems[i].itemId.itemRefId});res.end();
							res.end();
							logging.logger.log('info', req.session.username + "  | cart quantity not available |  "  + new Date().toString());
							break;
						}
						
						res.send({"statusCode" : 200,"message" : "success"});
						res.end();
						logging.logger.log('info', req.session.username + "  | Cart verified |  "  + new Date().toString());
					}
					else
					{
						res.send({"statusCode" : 404,"itemId" : "No item in cart"});res.end();
						res.end();
						logging.logger.log('info', req.session.username + "  | Empty Cart |  "  + new Date().toString());
					}
				});
			/*var itemQuery = "select * from items,cart where cart.itemId = items.itemId and cart.username = '" + req.session.username + "'";
			mysql.getData(function(error, response) {
				if(error)
				{
					throw error;
				}
				else
				{
					var i =0;
					for(i;i<response.length;i++)
					{
						if(response[i].quantity >= response[i].orderedquantity)
						{
							continue;
						}
						res.send({"statusCode" : 404,"itemId" : response[i].itemId});res.end();
						res.end();
						logging.logger.log('info', req.session.username + "  | cart quantity not available |  "  + new Date().toString());
					}
					res.send({"statusCode" : 200,"message" : "success"});res.end();
					res.end();
					logging.logger.log('info', req.session.username + "  | Cart verified |  "  + new Date().toString());
				}
			},itemQuery);*/
	}
}
function renderCheckOut(req,res)
{
	if(req.session.username)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		ejs.renderFile('./views/checkout.ejs', function(err, result)
		{
			if (!err)
			{
				res.end(result);
			}
			else
			{
				res.end("An error occured.");
				console.log(err);
			}
		});
	}
	else
	{
		res.redirect("/");
	}
}

function buy(req,res)
{
	if(req.session.username && req.session.cart != [])
	{
		
		
		var validTillMonth = req.param("validTill").split("/");
		var validTillYear = validTillMonth[1];
		validTillMonth = validTillMonth[0];
		var objCreditCard = new CreditCard(req.param("cardNumber"),req.param("cvvNumber"),validTillMonth, validTillYear);
		console.error("1");
		if (doValidations(objCreditCard) && !validateCart(req,res))
		{
			console.error("2");
			console.error(req.session.cart[0].seller);
			var date = dateTime.getCurrentDateTime();
			var response = {};
			mq_client.make_request('addTransaction', {"username":req.session.username,"total":req.session.total,"date":date}, function(err, results){
				if(!err && results.code == 200)
				{
					console.error("3");
					response.statusCode = 200;
					mq_client.make_request('deleteCart', {"username":req.session.username}, function(err1, results1){
					if(!err1 && results1.code == 200)
					{
						console.error("4");
						logging.logger.log('info', req.session.username + "  | Removed cart |  "  + new Date().toString());
					}
					else
					{console.error("5");
						response.statusCode = 401;res.send({"statusCode": 404});res.end();
					}
					});
					var i = 0;
					for(i;i<req.session.cart.length;i++)
					{
						if(response.statusCode == 200)
						{
							mq_client.make_request('addOrders', {"transactionId":results.transactionId, "seller":req.session.cart[i].seller,
								"itemId":req.session.cart[i].itemId,"orderedQuantity":req.session.cart[i].orderedquantity}, function(err2, results2){
							
							if(!err2 && results2.code == 200)
							{
								logging.logger.log('info', req.session.username + "  | Item bought from  | Seller id: "+response.insertId+" | "  + new Date().toString());
							}
							else
							{console.error("6");
								response.statusCode = 401;res.send({"statusCode": 404});res.end();
							}
							});
							
						}
						else
						{
							break;
						}
					}
					var j = 0;
					var count = 0;
					for(j;j<req.session.cart.length;j++)
					{
						if(response.statusCode == 200)
						{
							
							mq_client.make_request('updateItems', {"itemId":req.session.cart[j].itemId,"updateQuant":req.session.cart[j].orderedquantity}, function(err3, results3){
								if(!err3 && results3.code == 200)
								{count++;
									
									if(count == req.session.cart.length)
										{
										req.session.cart = [];
										req.session.total = 0;
										logging.logger.log('info', req.session.username + "  | Transaction Completed  | Transaction id: "+results.transactionId+" | "  + new Date().toString());
										res.send({"statusCode":200,"transaction": results.transactionId});res.end();
										console.error("10");
										}
								}
								else
								{console.error("7");
									response.statusCode = 401;res.send({"statusCode": 404});res.end();
								}	
							});	
						}
						else
						{
							break;
						}
					}
				}
				else
				{console.error("8");
					response.statusCode = 401;res.send({"statusCode": 404});res.end();
				}
			});
			/*var insertTransaction = "Insert into transaction (transactionDate,total,buyer) values ('" + date +"','"+req.session.total+"','"+req.session.username+"')";
			console.log("1");
			mysql.getData(function(error, responses) {
				if(error)
				{
					throw error;
				}
				else
				{
					var deleteCart = "delete from cart where username = '"+req.session.username+"'";
					
					mysql.getData(function(error, response) {
						if(error)
						{
							throw error;
						}
						else
						{
							logging.logger.log('info', req.session.username + "  | Removed cart |  "  + new Date().toString());
						}
					},deleteCart);
					var transactionId= responses.insertId;
					var j =0;
					for(j;j<req.session.cart.length;j++)
					{
						var insertSellers = "Insert into orders (transactionId,seller,itemId,orderedquantity) values ('" +transactionId+"','"+ req.session.cart[j].seller+"','"+req.session.cart[j].itemId+"','"+req.session.cart[j].orderedquantity+"')";
						var updatequant = Number(req.session.cart[j].availquantity) - Number(req.session.cart[j].orderedquantity);						
						var udpateItemTable = "update items set items.quantity = '" + updatequant + "' where items.itemId = '" + req.session.cart[j].itemId +"'";
						
						mysql.getData(function(error, response) {
							if(error)
							{
								throw error;
							}
							else
							{
								logging.logger.log('info', req.session.username + "  | Item bought from  | Seller id: "+response.insertId+" | "  + new Date().toString());
							}
						},insertSellers);
						
						mysql.getData(function(error, response) {
							if(error)
							{
								throw error;
							}
							else
							{
								logging.logger.log('info', req.session.username + "  | Item bought  | Item id: "+response.insertId+" | "  + new Date().toString());
								if(j >= req.session.cart.length)
									{
									req.session.cart = [];
									req.session.total = 0;
									logging.logger.log('info', req.session.username + "  | Transaction Completed  | Transaction id: "+transactionId+" | "  + new Date().toString());
									res.send({"statusCode":200,"transaction": transactionId});res.end();
									}
							}
						},udpateItemTable);
						
					}
				}
			},insertTransaction);*/			
		}
		else
		{
			console.log("should not come");
			res.send({"statusCode": 404});res.end();
		}
	}
	else
	{
		res.redirect("/");
	}
}

exports.buy = buy;
exports.renderCheckOut = renderCheckOut;
exports.validateCartQuant = validateCartQuant;