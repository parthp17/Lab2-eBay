"use strict"
var ejs = require("ejs");
//var mysql = require('./mysql');
var logging = require('./logging');
var mq_client = require('../rpc/client');

function getHomeValues(req, res) {
	if (req.session.username) {
		
		mq_client.make_request('getItemsQueue', {"username":req.session.username}, function(err, results)
				{
					console.log(results);
					if (err)
					{
						throw err;
					}
					else
					{
						if (results.code == 200)
						{
							
							res.send({
								"statusCode" : 200,
								"fname" : req.session.fname,
								"items":results.fetchedItems,
								"lastLoggedIn": req.session.lastLoggedIn,
								"username": req.session.username
							});
						}
						else
						{
							res.send({'statusCode':401});
							res.end();
							console.log("401");
						}
					}	
				});
		/*var getItems = "select * from items where items.quantity > 0 and items.owner != '" + req.session.username+"'";
		mysql.sendToPool(function(err, results)
				{
						if (err)
						{
							throw err;
						}
						else
						{
							if (results.length > 0)
							{
								console.log(req.session.lastLoggedIn);
								res.send({
									"statusCode" : 200,
									"fname" : req.session.fname,
									"items":results,
									"lastLoggedIn": req.session.lastLoggedIn,
									"username": req.session.username
								});
								res.end();
							}
							else
							{
								res.send({'statusCode':401});
								res.end();
								console.log("401");
							}
						}
					},getItems );*/
	}
}

exports.getHomeValues = getHomeValues;