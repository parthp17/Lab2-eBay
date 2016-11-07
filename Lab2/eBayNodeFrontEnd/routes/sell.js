"use strict"
var ejs = require("ejs");
//var mysql = require('./mysql');
var logging = require('./logging');
var mq_client = require('../rpc/client');


function sellReview(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{
		var itemParams = {
				"quantity" : req.session.itemQuantity,
				"itemName"  : req.session.itemName,
				"description" :  req.session.itemDesc,
				"price" :  req.session.itemPrice,
				"isBidding" : false,
				"owner" : req.session.username,
		};
		
		mq_client.make_request('addItemQueue', itemParams, function(error, result)
				{
					console.log(result);
					if (error)
					{
						throw error;
					}
					else
					{
						if(result.code == 200)
						{
							logging.logger.log('info', req.session.username + " | item added | " + new Date().toString());
							res.send({"statusCode":200});
							res.end();
						}						
						else
						{
							consle.log("401");
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