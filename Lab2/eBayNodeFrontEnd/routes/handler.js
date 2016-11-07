"use strict"
var ejs = require("ejs");
//var mysql = require('./mysql');
var logging = require('./logging');
var mq_client = require('../rpc/client');

function getBoughtTransactions(req,res)
{
	if(req.session.username)
	{
		/*var getBoughtItems = "select * from transaction,orders where buyer = '"+req.session.username+"' and transaction.transactionId= orders.transactionId";*/
		var purchased = [];
		mq_client.make_request('getBoughtTransactions', {"username": req.session.username}, function(error, result){
			if(error)
			{
				console.log(error);
			}
			else if(result.code ==200)
			{
				var i=0;
				var count1 = 0;
				for(i;i < result.transactions.length;i++)
				{
					mq_client.make_request('getOrders', {"transaction": result.transactions[i]}, function(err, results){
						if(!err)
						{count1++;
							var j =0;
							for (j;j < results.order.length;j++)
							{console.error(i);
								var json = {
										"transactionId" : results.transactions.transactionId,
										"transactionDate" : new Date(results.transactions.transactionDate).toLocaleString(),
										"total" : results.transactions.total,
										"buyer" : results.transactions.buyer,
										"seller" : results.order[j].seller,
										"itemId" : results.order[j].itemId,
										"orderedquantity" : results.order[j].orderedQuantity
									};
								console.error(json);
									purchased.push(json);
							}
							if(count1 == result.transactions.length)
							{
								res.send(purchased);
								console.error("purchased");
							}
						}
						else
						{
							console.log(err);
						}
					});
				}
			}
			else
			{
				
			}
		});
	/*	mysql.getData(function(error, response) {
			if(error)
			{
				throw error;
			}
			else
			{var i = 0;
				logging.logger.log('info', req.session.username + "  | getting bought items | "  + new Date().toString());
				for (i; i < response.length; i++) {
					var json = {
						"transactionId" : response[i].transactionId,
						"transactionDate" : new Date(response[i].transactionDate).toLocaleString(),
						"total" : response[i].total,
						"buyer" : response[i].buyer,
						"seller" : response[i].seller,
						"itemId" : response[i].itemId,
						"orderedquantity" : response[i].orderedquantity
					};
					purchased.push(json);
				}
				res.send(purchased);
			}
		},getBoughtItems);
		*/
		
	}
	else
	{
		res.redirect('/');
	}
}
function getSoldTransactions(req, res) {
	if (req.session.username) {
		//var getSoldItems = "select * from orders where seller = '"+req.session.username+"'";
		var sold = [];
		mq_client.make_request('getSoldTransactions', {"username": req.session.username}, function(err, results){
			if(!err)
			{
				res.send(results.order);
			}
			
		});
	} else {
		res.redirect('/');
	}
}

exports.getSoldTransactions = getSoldTransactions;
exports.getBoughtTransactions = getBoughtTransactions;