"use strict"
var ejs = require("ejs");
var soap = require('soap');
var baseURL = "http://localhost:8080/CalcWebService/services";

function add(req,res)
{
	var operand1 = req.param("operand1");
	var operand2 = req.param("operand2");
	
	if(isNaN(operand1) || isNaN(operand2))
	{
		res.send({"result":"Invalid Input"});
	}
	else
	{
		var option = {
				ignoredNamespaces : true	
			};
		 var url = baseURL+"/Calc?wsdl";
		  var args = {username: operand1,password: operand2};
		  soap.createClient(url,option, function(err, client) {
		      client.add(args, function(err, result) {
		    	  if(result.addReturn){
		    		  res.send({statusCode:200,"result":result.addReturn});
		    	  }
		    	  else{
		    		  res.send({statusCode:401});
		    	  }
		      });
		  });
	}
}

function sub(req,res)
{
	var operand1 = req.param("operand1");
	var operand2 = req.param("operand2");
	
	if(isNaN(operand1) || isNaN(operand2))
	{
		res.send({"result":"Invalid Input"});
		
	}
	else
	{
		var option = {
				ignoredNamespaces : true	
			};
		 var url = baseURL+"/Calc?wsdl";
		  var args = {username: operand1,password: operand2};
		  soap.createClient(url,option, function(err, client) {
		      client.sub(args, function(err, result) {
		    	  if(result.subReturn){
		    		  res.send({statusCode:200,"result":result.subReturn});
		    	  }
		    	  else{
		    		  res.send({statusCode:401});
		    	  }
		      });
		  });
	}
}

function mul(req,res)
{
	var operand1 = req.param("operand1");
	var operand2 = req.param("operand2");
	
	if(isNaN(operand1) || isNaN(operand2))
	{
		res.send({"result":"Invalid Input"});
	}
	else
	{
		var option = {
				ignoredNamespaces : true	
			};
		 var url = baseURL+"/Calc?wsdl";
		  var args = {username: operand1,password: operand2};
		  soap.createClient(url,option, function(err, client) {
		      client.mul(args, function(err, result) {
		    	  if(result.mulReturn){
		    		  res.send({statusCode:200,"result":result.mulReturn});
		    	  }
		    	  else{
		    		  res.send({statusCode:401});
		    	  }
		      });
		  });
	}
}
function div(req,res)
{
	var operand1 = req.param("operand1");
	var operand2 = req.param("operand2");
	
	if(isNaN(operand1) || isNaN(operand2))
	{
		res.send({"result":"Invalid Input"});
	}
	else
	{
		var result;
		operand1 = parseFloat(operand1);
		operand2 = parseFloat(operand2);
		if (operand2 != 0)
		{
			var option = {
					ignoredNamespaces : true	
				};
			 var url = baseURL+"/Calc?wsdl";
			  var args = {username: operand1,password: operand2};
			  soap.createClient(url,option, function(err, client) {
			      client.div(args, function(err, result) {
			    	  if(result.divReturn){
			    		  res.send({statusCode:200,"result":result.divReturn});
			    	  }
			    	  else{
			    		  res.send({statusCode:401});
			    	  }
			      });
			  });
		}
		else
		{
			result = "Cannot divide by Zero";
			res.send(
					{
						"result" : result
					});
		}
	}

}




function display(req,res)
{

	ejs.renderFile('./views/Calculator.ejs',{"title":"Calculator"},function(err,result){
		if(!err){
			res.end(result);
		}else
		{
				res.end("An error occured");
		}
	});
}

exports.add = add;
exports.sub = sub;
exports.mul = mul;
exports.div = div;
exports.display = display;