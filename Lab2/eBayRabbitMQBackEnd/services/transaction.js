"use strict";

var mongoose = require('./mongoose.js');

function handleRequestGetBoughtTransactions(msg, callback)
{
	var res = {};
	console.error(msg.username);
	mongoose.transaction.find({"buyer": msg.username},function(err, tran){
		if(err)
		{
			throw err;
		}	
		else if(tran)
		{
			res.code = 200;
			res.transactions = tran; 
		} 
		else
		{
			res.code = 401;
		}
		callback(null, res);
		});
}

function handleRequestGetSoldTransactions(msg, callback)
{
	var res = {};
	console.error(msg.username);
	mongoose.orders.find({"seller": msg.username},function(err, order){
		if(err)
		{
			throw err;
		}	
		else if(order)
		{
			res.code = 200;
			res.order= order; 
		} 
		else
		{
			res.code = 401;
		}
		callback(null, res);
		});
}

function handleRequestGetOrders(msg, callback)
{
	var res = {};
	var transaction = msg.transaction;
	mongoose.orders.find({"transactionId": transaction.transactionId},function(err, order){
		if(err)
		{
			throw err;
		}
		else if(order)
		{
			res.code = 200;
			res.order = order;
			res.transactions = transaction;
		} 
		else
		{
			res.code = 401;
		}
		callback(null, res);
		});
}


exports.handleRequestGetOrders = handleRequestGetOrders;
exports.handleRequestGetBoughtTransactions = handleRequestGetBoughtTransactions;
exports.handleRequestGetSoldTransactions = handleRequestGetSoldTransactions;