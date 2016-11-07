"use strict";

var mongoose = require("mongoose");
var mongoose = require('./mongoose.js');

function handleRequestDeleteCart(msg, callback)
{
	var res = {};
	mongoose.cart.remove({"username": msg.username},function(err, items){
		if(items)
		{
			res.code = 200;
			res.cartItems = items; 
		} 
		else
		{
			res.code = 401;
		}
		callback(null, res);
		});
}

function handleRequestAddTransaction(msg, callback)
{
	var res = {};
	var transactionToSave = new mongoose.transaction(
			{
				"transactionDate" : msg.date,
				"total" : msg.total,
				"buyer" : msg.username
			});
	transactionToSave.save(function(err, results)
			{
				if (!err)
				{
					res.code = 200;
					res.transactionId = results.transactionId;
				}
				else
				{
					res.code = 401;
					throw err;
				}
				callback(null, res);
			});
}

function handleRequestAddOrders(msg, callback)
{
	var res = {};
	var orderToSave = new mongoose.orders(
			{
				"transactionId" : msg.transactionId,
				"seller" : msg.seller,
				"itemId" : msg.itemId,
				"orderedQuantity" : msg.orderedQuantity
			});
	orderToSave.save(function(err, results)
			{
				if (!err)
				{
					res.code = 200;
					res.transactionId = results.transactionId;
				}
				else
				{
					res.code = 401;
					throw err;
				}
				callback(null, res);
			});
}

function handleRequestUpdateItems(msg, callback)
{
	var res = {};
	mongoose.items.findOneAndUpdate({
		"itemRefId" : msg.itemId
	},{
		$inc: {"quantity": -msg.updateQuant}
	}, function(err, result) {
		if (result) {
			res.code = 200;
		} else {
			res.code = 401;
		}
		callback(null, res);
	});
}

exports.handleRequestUpdateItems = handleRequestUpdateItems;
exports.handleRequestDeleteCart = handleRequestDeleteCart;
exports.handleRequestAddTransaction = handleRequestAddTransaction;
exports.handleRequestAddOrders = handleRequestAddOrders;