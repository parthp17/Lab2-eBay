"use strict"
var ejs = require("ejs");
//var mysql = require('./mysql');
var logging = require('./logging');
var url = require('url');
var mq_client = require('../rpc/client');

function getItem(req,res)
{
	if(req.session.username)
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		 var queryData = url.parse(req.url, true).query;
		 console.log(queryData.itemId);
		 mq_client.make_request('getItemQueue', {"itemRefId": queryData.itemId}, function(error, results)
					{
						//console.log(results);
						if (error)
						{
							throw error;
						}
						else
						{
							if(results.code = 200)
							{
								
								req.session.itemObjectId = results.itemObjectId;
								
								logging.logger.log('info', req.session.username + "  | viewed item: " +queryData.itemId+ " | "  + new Date().toString());
								ejs.renderFile('./views/item.ejs', {
						"itemName" : results.itemName,
						"itemDesc" : results.description,
						"itemQuantity" : results.quantity,
						"itemid" : results.itemId,
						"itemPrice" : results.price,
						"seller" : results.fname +" " +results.lname,
						"location" : results.city +" " + results.state,
						"fname" : req.session.fname,
						"lastLogged" : new Date(req.session.lastLoggedIn)
						
								.toLocaleString()
					}, function(err, result) {
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
								res.end("An error occured.");
							}
						}
					});
		 }
	else
	{
		res.redirect('/');
	}
}

exports.getItem = getItem;