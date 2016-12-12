"use strict"
var ejs = require("ejs");
var mysql = require('./mysql');
var logging = require('./logging');
var cart = require('./cart');
var dateTime = require('./DateTime');
var message;
var soap = require('soap');
var baseURL = "http://localhost:8080/eBayWebService/services";

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
			},itemQuery);
	}
}

function validateCartQuant(req,res)
{
	if(req.session.username && req.session.cart.length !== 0)
	{	
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var cart = req.session.cart;
		
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
						res.send({"statusCode" : 404,"itemId" : response[i].itemId});res.end();
						res.end();
						logging.logger.log('info', req.session.username + "  | cart quantity not available |  "  + new Date().toString());
					}
					res.send({"statusCode" : 200,"message" : "success"});res.end();
					res.end();
					logging.logger.log('info', req.session.username + "  | Cart verified |  "  + new Date().toString());
				}
			},itemQuery);
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
		if (doValidations(objCreditCard) && !validateCart(req,res))
		{
			var date = dateTime.getCurrentDateTime();
			
			var insertTransaction = "Insert into transaction (transactionDate,total,buyer) values ('" + date +"','"+req.session.total+"','"+req.session.username+"')";
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
			},insertTransaction);			
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