"use strict"
var ejs = require("ejs");
var mysql = require('./mysql');
var logging = require('./logging');
var soap = require('soap');
var baseURL = "http://localhost:8080/eBayWebService/services";

function sellReview(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{		
		var quantity = req.session.itemQuantity;
		var name = req.session.itemName;
		var desc =  req.session.itemDesc;
		var price =  req.session.itemPrice;
		var isBidding = 0;
		
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/SellDao?wsdl";
		  var args = {username : req.session.username};
		  soap.createClient(url,option, function(err, client) {
		      client.sellReview(args, function(err, result) {
		    	  if(result){
		    		  logging.logger.log('info', req.session.username + " | item added | " + new Date().toString());
						res.send({"statusCode":200});
						res.end();
		    	  }
		    	  else{
		    		  	console.log("401");
						res.send({'statusCode':401});
						res.end();
		    	  }
		      });
		  });
	}
	else
	{
		res.redirect('/');
	}
}

function sellInfo(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{
		req.session.itemName = req.param("itemname");
		req.session.itemDesc = req.param("desc");
		req.session.itemQuantity = req.param("quantity");
		req.session.itemPrice = req.param("price");		
		res.send({"statusCode":200});
		res.end();
						
	}
}
exports.sellInfo = sellInfo;
exports.sellReview = sellReview;