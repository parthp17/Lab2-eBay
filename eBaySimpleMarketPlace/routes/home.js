"use strict"
var ejs = require("ejs");
var mysql = require('./mysql');
var logging = require('./logging');
var soap = require('soap');
var baseURL = "http://localhost:8080/eBayWebService/services";


function getHomeValues(req, res) {
	if (req.session.username) {
		
		var option = {
				ignoredNamespaces : true	
			};
		var date = dateTime.getCurrentDateTime();
		 var url = baseURL+"/HomeDao?wsdl";
		  var args = {username: username};
		  soap.createClient(url,option, function(err, client) {
		      client.getHomeValues(args, function(err, result) {
		    	  if(result != null && result.getHomeValuesReturn != null){
		    		  res.send({
							"statusCode" : 200,
							"fname" : req.session.fname,
							"items":result.getHomeValuesReturn,
							"lastLoggedIn": req.session.lastLoggedIn,
							"username": req.session.username
						});
						res.end();
		    	  }
		    	  else{
		    		  res.send({'statusCode':401});
		    		  res.end();
		    		  console.log("401");
		    	  }
		      });
		  });
	
		
		
		
		
/*		var getItems = "select * from items where items.quantity > 0 and items.owner != '" + req.session.username+"'";
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
								
							}
							else
							{
								
							}
						}
					},getItems );
	}*/
}
}
exports.getHomeValues = getHomeValues;