"use strict"
var ejs = require("ejs");
var mysql = require('./mysql');
var logging = require('./logging');
var soap = require('soap');
var baseURL = "http://localhost:8080/eBayWebService/services";

function getBoughtTransactions(req,res)
{
	if(req.session.username)
	{
		
		var option = {
				ignoredNamespaces : true	
			};
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/HandlerDao?wsdl";
		  var args = {username: req.session.username};
		  soap.createClient(url,option, function(err, client) {
		      client.getBoughtTransactions(args, function(err, result) {
		    	  if(result != null ){
		    		  logging.logger.log('info', req.session.username + "  | getting bought items | "  + new Date().toString());
		    		  res.send(result.getBoughtTransactionsReturn);
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
		res.redirect('/');
	}
}
function getSoldTransactions(req, res) {
	if (req.session.username) {
		
		var option = {
				ignoredNamespaces : true	
			};
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/HandlerDao?wsdl";
		  var args = {username: req.session.username};
		  soap.createClient(url,option, function(err, client) {
		      client.getSoldTransactions(args, function(err, result) {
		    	  if(result){
		    		  logging.logger.log('info', req.session.username	+ "  | getting bought items | "	+ new Date().toString());
		    		  res.send(result.getSoldTransactionsReturn);
		    	  }
		    	  else{
		    		  res.send({'statusCode':401});
		    		  res.end();
		    	  }
		      });
		  });
	} else {
		res.redirect('/');
	}
}

exports.getSoldTransactions = getSoldTransactions;
exports.getBoughtTransactions = getBoughtTransactions;