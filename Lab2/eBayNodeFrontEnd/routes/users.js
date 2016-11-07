"use strict";
var ejs = require("ejs");
//var mysql = require('./mysql');
var logging = require('./logging');
var dateTime = require('./DateTime');
var bcrypt = require('bcryptjs');
var mq_client = require('../rpc/client');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require("express");
var router = express.Router();



function regexTest(regex, value)
{
	if (regex.test(value))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function signOut(req,res)
{
	//save the session
	logging.logger.log('info', req.session.username + "  | Signed Out | " + new Date().toString());
	req.session.destroy();
	res.send({"statusCode":200});
}
 
passport.use('login',new LocalStrategy(
		  function(username, password, done) {
			  console.error("0");
				mq_client.make_request('loginQueue', {"username":username,"password":password}, function(err, results){
					if(err) 
					{
						return done(err);
					}
					else if(results.code == 200)
					{		
							
							return done(null,results.user);
					} 
					else
					{
						return done(null,false);
					}
				});
		  }
		));

function logIn(req,res,next)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var username = req.param("username");
	var password = req.param("password");//
	//var password =bcrypt.hashSync(req.param("password"), bcrypt.genSaltSync(17));
	var mailregex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	if(!regexTest(mailregex,username))
	{
		res.send({'statusCode' : 401});
	}
	console.error("0");
	passport.authenticate('login', function(err, user, info) {console.error("2");
	    if(err) {
	      return next(err);
	    }

	    if(!user) {
	      return res.send({"statusCode":404});
	    }

	    req.logIn(user, {session:false}, function(err) {console.error("24");
	      if(err) {
	        return next(err);
	      }
	      console.error("3");
	      var date = dateTime.getCurrentDateTime();
			var updateLastLoggedIn = {"username" : username,"lastLoggedIn":date};
			mq_client.make_request('lastloggedInQueue', updateLastLoggedIn, function(error, result)
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
								req.session.username = user.username;
								req.session.fname = user.firstName;
								req.session.lname = user.lastName;
								req.session.email = user.email;
								req.session.lastLoggedIn = user.lastLoggedIn;
								//req.session.userId = results.userId;
								console.error(req.session.lname);
								console.log("session initilized");
								logging.logger.log('info', req.session.username + " | Signed In | " + new Date().toString());
								return res.send({'statusCode':200});
							}
							else
							{
								return res.send(
								{
									"statusCode" : 401
								});
							}
						}
					});
	    });
	  })(req, res, next);	
}

function signUp(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var email = req.param("email");
	var mailregex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	var nameregex = /^[a-zA-Z ]{0,25}$/;
	
	/*if(!(regexTest(mailregex,req.param("username")) && regexTest(nameregex,req.param("fname")) 
			&& regexTest(nameregex,req.param("lname")) && (email ==req.param("re-email")) ))
	{
		res.send({'statusCode' : 401});
	}*/
	var date = dateTime.getCurrentDateTime();
	//var psswrd = bcrypt.hashSync(req.param("password"), bcrypt.genSaltSync(17));
	var registerationParams =
	{
	    "username" : email,
	    "password" : req.param("password"),
	    "email" : email,
	    "fname" : req.param("fname"),
	    "lastLoggedIn" : date,
	    "lname" : req.param("lname")
	};
	
	mq_client.make_request('registerQueue', registerationParams, function(error, result)
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
						req.session.username = email;
						req.session.fname = req.param("fname");
						req.session.lastLoggedIn =date;
						
						console.log(req.session.lastLoggedIn);
						logging.logger.log('info', email + " | Registered | " + new Date().toString());
						res.send({"statusCode": 200 });
						res.end();
					}
					else if(result.code == 409)
					{
						console.log(result.code);
						res.send({"statusCode": 409 , "message": result.message});
						res.end();
					}
					else
					{
						res.send({"statusCode": 404});
						res.end();
					}
				}
			});	
}

function updateProfile(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{
		var profileParams =
		{
		    "birthday" : req.param("birthday"),
		    "adrLine1" : req.param("adrLine1"),
		    "adrLine2" : req.param("adrLine2"),
		    "city" : req.param("city"),
		    "contact" : req.param("contact"),
		    "state" : req.param("state"),
		    "zipcode" : req.param("zipcode"),
		    "country" : req.param("country"),
		    "username" : req.session.username
		};
		
		mq_client.make_request('updateProfileQueue', profileParams, function(error, result)
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
					logging.logger.log('info', req.session.username + " | Profile Updated | " + new Date().toString());
					res.send({"statusCode":200});
					res.end();
					console.log("response sent");
				}
				else
				{
					res.send({"statusCode": 404});
					res.end();
				}
			}
		});
	}
	else
	{
		res.redirect("/");
	}
}

function getProfile(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{
		mq_client.make_request('getProfileQueue', {"username": req.session.username}, function(error, result)
				{
					console.log(result);
					if (error)
					{
						throw error;
					}
					else
					{
						if(result.code = 200)
						{
							console.log("200");
							res.send({"statusCode":200,"result" : result.userInfo,"fname":req.session.fname,"lname":req.session.lname,"email":req.session.username});
							res.end();
						}
						else
						{
							console.log("401");
							res.send({'statusCode':401});
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
exports.signOut = signOut;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.logIn = logIn;
exports.signUp = signUp;