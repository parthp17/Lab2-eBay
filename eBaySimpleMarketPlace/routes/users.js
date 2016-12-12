"use strict"
var ejs = require("ejs");
var mysql = require('./mysql');
var logging = require('./logging');
var dateTime = require('./DateTime');
var cryptojs = require("crypto-js");
var soap = require('soap');
var baseURL = "http://localhost:8080/eBayWebService/services";

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

function logIn(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var username = req.param("username");
	var password = req.param("password");
	var mailregex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	if(!regexTest(mailregex,username))
	{
		res.send({'statusCode' : 401});
	}
	var option = {
			ignoredNamespaces : true	
		};
	var date = dateTime.getCurrentDateTime();
	 var url = baseURL+"/usersDao?wsdl";
	  var args = {username: username,password: password, date : date};
	  soap.createClient(url,option, function(err, client) {
	      client.logIn(args, function(err, result) {
	    	  if(result != null){
	    		  console.log(result.logInReturn);
	    		  	req.session.username = result.logInReturn.username;
					req.session.fname = result.logInReturn.firstname;
					req.session.lname = result.logInReturn.lastname;
					req.session.email = result.logInReturn.email;
					req.session.lastLoggedIn = result.logInReturn.lastLoggedIn.$value; 
					res.send({'statusCode':200});
					res.end();
					var date = dateTime.getCurrentDateTime();
					logging.logger.log('info', username + " | Signed In | " + new Date().toString());
					res.send({statusCode:200,"result":result.addReturn});
					res.end();
	    	  }
	    	  else{
	    		  res.send({'statusCode':401});
	    		  res.end();
	    	  }
	      });
	  });
	
	
	
}

function signUp(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var email = req.param("email");
	var mailregex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	var nameregex = /^[a-zA-Z ]{0,25}$/;
	
	if(!(regexTest(mailregex,req.param("username")) && regexTest(nameregex,req.param("fname")) 
			&& regexTest(nameregex,req.param("lname")) && (mail ==req.param("re-email")) ))
	{
		res.send({'statusCode' : 401});
	}
	var option = {
			ignoredNamespaces : true	
		};
	var date = dateTime.getCurrentDateTime();
	 var url = baseURL+"/usersDao?wsdl";
	  var args = {username: req.param("username"),password: req.param("password"), firstname:req.param("fname"),lastname:req.param("lname"),date : date, email:email};
	  soap.createClient(url,option, function(err, client) {
	      client.signUp(args, function(err, result) {
	    	  if(result){
	    		  req.session.username = email;
					req.session.fname = req.param("fname");
					var date = dateTime.getCurrentDateTime();
					req.session.lastLoggedIn =date;
					console.log(req.session.lastLoggedIn);
					logging.logger.log('info', email + " | Registered | " + new Date().toString());
					res.send({"statusCode": 200 });
					res.end();
	    	  }
	    	  else{
	    		  res.send({'statusCode':401});
	    		  res.end();
	    	  }
	      });
	  });
}

function updateProfile(req,res)
{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{
		var birthday = req.param("birthday");
		var adrLine1 = req.param("adrLine1");
		var adrLine2 = req.param("adrLine2");
		var city = req.param("city");
		var contact = req.param("contact");
		var state = req.param("state");
		var zipcode = req.param("zipcode");
		var country = req.param("country");
		var option = {
				ignoredNamespaces : true	
			};
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/usersDao?wsdl";
		  var args = {username: req.session.username,birthday:birthday,adrLine1:adrLine1,adrLine2:adrLine2,city:city,contact:contact, state:state,zipcode:zipcode };
		  soap.createClient(url,option, function(err, client) {
		      client.updateInfo(args, function(err, result) {
		    	  if(result){
		    		  	logging.logger.log('info', req.session.username + " | Profile Updated | " + new Date().toString());
						res.send({"statusCode":200});
						res.end();
		    	  }
		    	  else{
		    		  res.send({'statusCode':401});
		    		  res.end();
		    	  }
		      });
		  });
	}
	else
	{
		res.redirect("/");
	}
}

function getProfile(req,res)
{res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.session.username)
	{
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/usersDao?wsdl";
		  var args = {username : req.session.username};
		  soap.createClient(url,option, function(err, client) {
		      client.getProfile(args, function(err, result) {
		    	  if(result != null && result.getProfileReturn != null){
		    		  	console.log("200");
						res.send({
						'statusCode' : 200,
						"birthday" : result.getProfileReturn.birthday,
						"adrLine1" : result.getProfileReturn.adrline1,
						"adrLine2": result.getProfileReturn.adrline2,
						"state": result.getProfileReturn.state,
						"city":result.getProfileReturn.city,
						"contact":result.getProfileReturn.contact,
						"zipcode":result.getProfileReturn.zipcode,
						"fname" : req.session.fname,
						"lname" : req.session.lname,
						"email" : req.session.email
					});
						res.end();
		    	  }
		    	  else{
		    		  	console.log("401");
						res.send({'statusCode':401});
						res.end();
		    	  }
		      });
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