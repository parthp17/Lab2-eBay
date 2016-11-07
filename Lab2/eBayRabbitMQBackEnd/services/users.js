"use strict";

var mongoose = require("mongoose");
var mongoose = require('./mongoose.js');

function handleRequestGetUser(msg,callback){
	var res = {};
	console.log("In handle request:"+ msg.username);

	mongoose.users.findOne({"username": msg.username}, function(err, user){
		if (user) {
			
					res.code = 200;
					res.user = user;
					callback(null, res);
				
			
		} 
	else {
			
			console.log("returned false1");
			res.code = 401;
			callback(null, res);
		}
		
	});

}

function handleRequestLogin(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);

	mongoose.users.findOne({"username": msg.username}, function(err, user){
		if (user) {
			user.comparePassword(msg.password,function(error, isMatch){
				if (error) throw error;
				else if(isMatch)
 				{
					res.code = 200;
					res.user = user;
					callback(null, res);
				}
				else
				{
					console.log("returned false2");
					res.code = 401;
					callback(null, res);
				}
			});
		} else {
			
			console.log("returned false1");
			res.code = 401;
			callback(null, res);
		}
		
	});
}

function handleRequestUpdateLastLoggin(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
	mongoose.users.update({"username": msg.username},{ $set: { "lastLoggedIn": msg.lastLoggedIn }} ,function(err){
		if (!err) {
			res.code = 200;
			console.log("Success");
		} else {
			res.code = 401;
			console.log("Failed");
		}
		callback(null, res);
	});	
}

function handleRequestRegistration(msg, callback)
{

	var res =
	{};
	console.log("In handle request: handleRequestRegistration"  );
	var userToSave = new mongoose.users(
	{
	    "firstName" : msg.fname,
	    "lastName" : msg.lname,
	    "username" : msg.username,
	    "password" : msg.password,
	    "lastLoggedIn": msg.lastLoggedIn,
	    "email": msg.email
	});
	userToSave.save(function(err, results)
	{
		if (!err)
		{console.error("1");
			res.code = 200;
			res.fname = results.firstName;
			res.lname = results.lastName;
			res.username = results.username;
			res.lastLoggedIn = results.lastLoggedIn;
		}
		else if (err.code == 11000)
		{console.error("2");
			res.code = 409;
			res.message = "User Already registered.";
			callback(null, res);
		}
		else
		{console.error("3");
			res.code = 401;
			throw err;
		}
		callback(null, res);
	});
}

function handleRequestUpdateProfile(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	var profileInfo = new mongoose.userInfo({
		"birthday": msg.birthday,
		"adrLine1": msg.adrLine1,
		"adrLine2": msg.adrLine2,
		"city": msg.city,
		"contact": msg.contact,
		"state": msg.state,
		"zipcode": msg.zipcode,
		"country": msg.country
	});
	
	mongoose.users.findOne({"username": msg.username}, function(err, user){
		if (user) {
			user.userInfo = profileInfo;
			user.save(function(error){
			if(!error)
			{
				res.code = 200;	
			}
			else
			{
				res.code = 401;
			}
			callback(null, res);
		});
	} else {
			res.code = 401;
			callback(null, res);
		}
	});
}


function handleRequestGetProfile(msg, callback){
	
	var res = {};
	
	mongoose.users.findOne({"username": msg.username},function(err, user){
	if (user) {
		res.code = 200;
		res.userInfo = user.userInfo;
	} 
	else
	{
			res.code = 401;
	}
	callback(null, res);
	});
}

exports.handleRequestGetProfile = handleRequestGetProfile;
exports.handleRequestRegistration = handleRequestRegistration;
exports.handleRequestUpdateLastLoggin = handleRequestUpdateLastLoggin;
exports.handleRequestLogin = handleRequestLogin;
exports.handleRequestUpdateProfile = handleRequestUpdateProfile;
exports.handleRequestGetUser= handleRequestGetUser;