"use strict"
var ejs = require("ejs");
var mysql = require('./mysql');
var logging = require('./logging');
var soap = require('soap');
var baseURL = "http://localhost:8080/eBayWebService/services";

function addToCart(req,res)
{
	if(req.session.username)
	{
		 //var queryData = url.parse(req.url, true).query;
		 //var quant = queryData.itemId;
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		 
		var option = {
				ignoredNamespaces : true	
			};
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/CartDao?wsdl";
		  var args = {username: req.session.username,updatedquantity:req.param("updatedquantity"),itemId:req.param("itemId")};
		  soap.createClient(url,option, function(err, client) {
		      client.addToCart(args, function(err, result) {
		    	  if(result){
		    		  logging.logger.log('info', req.session.username + "  | Item added to cart: " +req.param("itemId")+ " | "  + new Date().toString());
						res.send({"statusCode":200});
						res.end();
		    	  }
		    	  else{
		    		  res.send({'statusCode':401});
		    		  res.end();
		    	  }
		      });
		  });
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
		var option = {
				ignoredNamespaces : true	
			};
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/CartDao?wsdl";
		  var args = {username: req.session.username};
		  soap.createClient(url,option, function(err, client) {
		      client.getMycart(args, function(err, result) {
		    	  if(result != null){
		    		  var  i;
		    		  for(i =0 ; i<result.getMycartReturn;i++)
		    		  {
		    			  total += (Number(getMycartReturn[i].price))*(Number(getMycartReturn[i].orderedquantity));
		    		  }
		    		  req.session.total = total;
		    		  req.session.cart = cartContent; 
		    		  logging.logger.log('info', req.session.username + "  | Viewed cart  | "  + new Date().toString());
		    		  res.send({"cart" : result.getMycartReturn,"total":total});
		    	  }
		    	  else{
		    		  res.send({'statusCode':401});
		    		  res.end();
		    	  }
		      });
		  });
	}
}

function removeFromCart(req,res)
{
	if(req.session.username)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		 //var queryData = url.parse(req.url, true).query;
		 //var quant = queryData.itemId;

		 var quant = 1;
		 var option = {
					ignoredNamespaces : true	
				};
			var date = dateTime.getCurrentDateTime();
			 var url = baseURL+"/CartDao?wsdl";
			  var args = {username: req.session.username,itemId:req.param("itemId")};
			  soap.createClient(url,option, function(err, client) {
			      client.removeFromCart(args, function(err, result) {
			    	  if(result){
			    		  logging.logger.log('info', req.session.username + "  | Item removed from cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.redirect('/getMycart');
			    	  }
			    	  else{
			    		  res.send({'statusCode':401});
			    		  res.end();
			    	  }
			      });
			  });
	}
}

function updateCart(req,res)
{
	if(req.session.username)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		 //var queryData = url.parse(req.url, true).query;
		 //var quant = queryData.itemId;
		 var quant = 1;
		 var option = {
					ignoredNamespaces : true	
				};
			var date = dateTime.getCurrentDateTime();
			 var url = baseURL+"/CartDao?wsdl";
			  var args = {username: req.session.username,updatedquantity:req.param("updatedquantity"),itemId:req.param("itemId")};
			  soap.createClient(url,option, function(err, client) {
			      client.updateCart(args, function(err, result) {
			    	  if(result){
			    		  logging.logger.log('info', req.session.username + "  | updated quantity in cart: " +req.param("itemId")+ " | "  + new Date().toString());
							res.redirect('/getMycart');
			    	  }
			    	  else{
			    		  res.send({'statusCode':401});
			    		  res.end();
			    	  }
			      });
			  });
	}
}
exports.updateCart = updateCart;
exports.getMycart = getMycart;
exports.renderCart = renderCart;
exports.addToCart = addToCart; 
exports.removeFromCart = removeFromCart;