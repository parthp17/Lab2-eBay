"use strict";

var mongoose = require("mongoose");
var mongoose = require('./mongoose.js');

function handleRequestAddToCart(msg, callback)
{
	var res =	{};
console.log(msg.itemObjectId);
	mongoose.cart.findOneAndUpdate({"username": msg.username, "itemId": msg.itemObjectId},{$inc: {orderedQuantity: msg.orderedQuantity}},{upsert:true, new:true},function(error,cartItem){
		if(error)
		{
			res.code = 401;
			throw error;
			callback(null, res);
		}
		else
		{
			res.code = 200;
			console.log(cartItem);
			res.itemId = cartItem.itemId;
			callback(null, res);
		}
		console.log(res);
	});	
}

function handleRequestGetMycart(msg, callback){
	var res = {};
	mongoose.cart.find({"username": msg.username})
	.populate('itemId')
	.exec(function(err, items){
		if(err)
		{
			throw err;
		}
		else if(items)
		{
			
			console.error("1");
			res.code = 200;
			res.cartItems = items; 
		} 
		else
		{
			console.error("2");
			res.code = 401;
		}
		callback(null, res);
		});
}

function handleRequestRemoveFromCart(msg, callback){
	var res = {};
	mongoose.cart.findOneAndRemove({"username": msg.username, "itemId":msg.itemId},function(err,result){
		if(err)
			{
			 throw err;
			}
		else if(result)
		{
			console.error("200");
			res.code = 200;
		}
		else
		{
			console.error("401");
			res.code = 401;
		}
		callback(null, res);
	});
}

function handleRequestUpdateCart(msg, callback){
	var res = {};
	mongoose.cart.findOneAndUpdate({
		"username" : msg.username,
		"itemId" : msg.itemObjectId
	}, {
		"orderedQuantity" : msg.orderedQuantity
	}, function(err, result) {
		if (result) {
			res.code = 200;
		} else {
			res.code = 401;
		}
		callback(null, res);
	});
}

exports.handleRequestUpdateCart =handleRequestUpdateCart;
exports.handleRequestRemoveFromCart =handleRequestRemoveFromCart;
exports.handleRequestAddToCart =handleRequestAddToCart;
exports.handleRequestGetMycart =handleRequestGetMycart;