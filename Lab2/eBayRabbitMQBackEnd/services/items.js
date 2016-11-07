"use strict";

var mongoose = require("mongoose");
var mongoose = require('./mongoose.js');

function handleRequestAddItem(msg, callback)
{
	var res = {};	
		var itemToSave = new mongoose.items(
				{
					"itemName": msg.itemName,
					"description" : msg.description,
					"quantity" : msg.quantity,
					"price" : msg.price,
					"isBidding" : msg.isBidding,
					"owner":msg.owner
				});
				itemToSave.save(function(err, results)
				{
					if(!err)
					{
						//results.owner = user;
						console.log(results);
						res.code = 200;
					}
					else
					{
						res.code = 401;
						console.error(err);
					}
					callback(null, res);
				});
}


function handleRequestGetItem(msg, callback){
	
	var res = {};
	console.log(msg.itemRefId);
	
	mongoose.items.findOne({"itemRefId": msg.itemRefId},function(error,item){
		if(error)
		{
		throw error;
		}
		else if(item)
		{
			mongoose.users.findOne({"username":item.owner}, function(err,user)
					{
						if(err) {throw err;}
						else if(user)
							{
							console.log(item);
							res.code = 200;
							res.itemId = item.itemRefId;
							res.itemName = item.itemName;
							res.description = item.description;
							res.quantity = item.quantity;
							res.price = item.price;
							res.owner = item.owner;
							res.fname = user.firstName;
							res.lname= user.lastName;
							res.state = user.userInfo.state;
							res.city = user.userInfo.city;
							res.itemObjectId =item._id;
							console.log(item);
							callback(null, res);
							}
						else
						{
							res.code = 401;
							console.log("1");
							console.log(item);
							callback(null, res);
						}
				
					});
		}else
		{
			res.code = 401;
			console.log("1");
			console.log(item);
			callback(null, res);
		}
		
		
	});
	
	/*,function(err,res)
			{
				console.log(res);
			});*/
	/*mongoose.items.findOne({"itemRefId": msg.itemRefId})
	.populate('owner')
	.exec(function(error,item){
		if(error)
		{
		throw error;
		}
		else if(item)
		{
			console.log(item);
			res.code = 200;
			res.itemId = item.itemRefId;
			res.itemName = item.itemName;
			res.description = item.description;
			res.quantity = item.quantity;
			res.price = item.price;
			res.fname = item.owner.firstName;
			res.lname= item.owner.lastName;
			res.state = item.owner.userInfo.state;
			res.city = item.owner.userInfo.city;
			res.itemObjectId = item._id;
			console.log(user);
			callback(null, res);
		}
		else
		{
			res.code = 401;
			console.log("1");
			console.log(user);
			callback(null, res);
		}
	});*/
	}

function handleRequestGetItems(msg, callback){
	var res = {};
	mongoose.items.find({"owner":{$ne: msg.username}, "quantity": {$gt: 0}}, function(err, item){
	if(err)
	{
		res.code = 401;
		console.error(err);
	}
	else if(item)
	{
			console.log(item);
			res.code = 200;
			res.fetchedItems = item;
	} 
	else
	{
		console.log("here");
			res.code = 401;
	}
	callback(null, res);
	});
}

exports.handleRequestGetItem = handleRequestGetItem;
exports.handleRequestGetItems = handleRequestGetItems;
exports.handleRequestAddItem = handleRequestAddItem;